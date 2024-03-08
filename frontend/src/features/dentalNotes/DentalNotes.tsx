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

// Assuming you have a type or interface for your questions
interface Question {
  id: number;
  text: string;
  options: string[];
}

const [questions, setQuestions] = useState<Question[]>([]);

useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  fetchQuestions();
}, []);

const DentalNotes: React.FC  = () => {
  const theme = useSelector((state: any) => state.home.theme)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({});
  const { send, socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('updateExamination', (data: { questionId: number; option: string }) => {
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

  const handleOptionSelect = async (patientId: string, questionId: number, option: string) => {
    // Assuming you have a way to get the current clinician's ID
    const clinicianId = "clinician's ID"; // This should be dynamically obtained

    try {
      await fetch('/api/examinations/saveSelection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicianId,
          patientId,
          questionId,
          selectedOptions: [option],
        }),
      });

      console.log('Selection saved successfully');
    } catch (error) {
      console.error('Error saving selection:', error);
    }
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
            <div key={question.id} className="question">
              <div className="title">{question.text}</div>
              <div className="options">
                {question.options.map((option) => (
                  <button
                  key={option}
                  className={`option-button ${selectedOptions[question.id]?.includes(option) ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect("test", question.id, option)} //! hard coded patient ID
                >
                  {option}
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
