import './DentalNotes.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileAlt,
  faHome,
  faStar,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import React, { useState, useEffect, useCallback } from 'react';
import useSocket from '../../core/hooks/useSocket';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RootState } from '../../core/store/store';

// Assuming you have a type or interface for your questions
interface Question {
  _id: string;
  text: string;
  options: { text: string }[];
  single: boolean;
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
      socket.on('updateExamination', (data: { questionId: string; option: string }) => {
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

  

  const handleOptionSelect = async (patientId: string, questionId: string, option: string, singleSelect: boolean = false) => {
    const clinicianId = "clinician's ID"; // Dynamically obtained, ensure this is correctly fetched.

    setSelectedOptions(prevSelectedOptions => {
      const isOptionSelected = prevSelectedOptions[questionId]?.includes(option);
      let newSelectedOptions;

      if (isOptionSelected) {
        // Filter out the deselected option
        newSelectedOptions = {
          ...prevSelectedOptions,
          [questionId]: prevSelectedOptions[questionId].filter(selectedOption => selectedOption !== option),
        };
      } else {
        // Add the newly selected option
        newSelectedOptions = {
          ...prevSelectedOptions,
          [questionId]: [...(prevSelectedOptions[questionId] || []), option],
        };
      }
      console.log(newSelectedOptions)
      return newSelectedOptions;
    });

    // Following this update, you would continue with your backend update and socket emissions as necessary.

    // // Prepare data to send to backend
    // const dataToSend = {
    //   clinicianId,
    //   patientId,
    //   questionId,
    //   selectedOptions: selectedOptions[questionId] || [],
    // };

    // // Update the selection state in the backend
    // try {
    //   await axios.post('/api/examinations/updateSelection', dataToSend, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   console.log('Selection updated successfully');
    // } catch (error) {
    //   console.error('Error updating selection:', error);
    // }

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
                {question.options.map((option, index) => {
                  console.log(`Rendering option ${option.text} for question ${question._id}:`, selectedOptions[question._id]?.includes(option.text) ? 'selected' : 'not selected');
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect("test", question._id, option.text)}
                      className={`option-button ${selectedOptions[question._id]?.includes(option.text) ? 'selected' : ''}`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DentalNotes
