import './DentalNotes.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileAlt,
  faHome,
  faStar,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react';
import useSocket from '../../core/hooks/useSocket';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RootState } from '../../core/store/store';

// Assuming you have a type or interface for your questions
interface Question {
  _id: string;
  text: string;
  options: { text: string }[];
}

const DentalNotes: React.FC = () => {
  //pull question from question bank database
  const [questions, setQuestions] = useState<Question[]>([]);
  const apiUrl: string = useSelector((state: RootState) => state.home.apiUrl);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/questions/retrieve`);
      setQuestions(response.data.result);
      console.log(response.data.result)
    } catch (error) {
      console.error('Failed to load questions', error);
      toast.warn('Failed to load questions');
    }
  }

  const theme = useSelector((state: any) => state.home.theme)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const { send, socket } = useSocket();

  useEffect(() => {
    if (socket) {
      console.log('Attempting to connect...');

      socket.on('updateExamination', (data: { questionId: string; option: string }) => {
        console.log('Examination data updated', data);
        const { questionId, option } = data;
        setSelectedOptions(prev => ({
          ...prev,
          [questionId]: prev[questionId] ? [...prev[questionId], option] : [option],
        }));
      });

      return () => {
        if (socket) {
          socket.off('connect');
          socket.off('updateExamination');
        }
      };
    }
  }, [socket]);

  const handleOptionSelect = async (patientId: string, questionId: string, option: string) => {
    const clinicianId = "clinician's ID"; // This should be dynamically obtained
  
    try {
      await axios.post('/api/examinations/saveSelection', {
        clinicianId,
        patientId,
        questionId,
        selectedOptions: [option],
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Selection saved successfully');
    } catch (error) {
      console.error('Error saving selection:', error);
    }

    // Emit the selection to the server
    send('selectExaminationOption', { questionId, option });
  };

  return (
    <div
      className={`home-container animate__animated animate__fadeIn animate__delay-1s ${theme}`}
    >
      <div className="content">
        <div className="title">
          <FontAwesomeIcon className="icon" icon={faHome} />
          Welcome
        </div>


        <div className="dental-notes">
          {questions.map((question) => (
            <div key={question._id} className="question">
              <div className="title">{question.text}</div>
              <div className="options">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${selectedOptions[question._id]?.includes(option.text) ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect("test", question._id, option.text)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DentalNotes
