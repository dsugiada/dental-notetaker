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

const questions = [
  {
    id: 1,
    text: "Question 1",
    options: ["Option 1", "Option 2", "Option 3"],
  },
  // Add more questions as needed
];

const DentalNotes = () => {
  const theme = useSelector((state: any) => state.home.theme)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({});
  const { send, socket } = useSocket();

  useEffect(() => {
    if (socket) {
      console.log('Attempting to connect...');

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

  const handleOptionSelect = (questionId: number, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: prev[questionId] ? [...prev[questionId], option] : [option],
    }));
    // Emit the selection to the server
    send('selectExaminationOption', { questionId, option });
    console.log(`Option selected: questionId=${questionId}, option=${option}`);
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
                  onClick={() => handleOptionSelect(question.id, option)}
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
