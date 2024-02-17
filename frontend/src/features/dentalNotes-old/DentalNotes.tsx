// src/features/dentalNotes/DentalNotes.tsx
import React, { useState, useEffect } from 'react';
import useSocket from '../../core/hooks/useSocket';
import './DentalNotes.scss';

const questions = [
  {
    id: 1,
    text: "Question 1",
    options: ["Option 1", "Option 2", "Option 3"],
  },
  // Add more questions as needed
];

const DentalNotes = () => {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({});
  const { send, socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('updateExamination', (data: { questionId: number; option: string }) => {
        console.log('Examination data updated', data);
        const { questionId, option } = data;
        setSelectedOptions(prev => ({
          ...prev,
          [questionId]: prev[questionId] ? [...prev[questionId], option] : [option],
        }));
      });

      return () => {
        if (socket) {
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
    <div className="dental-notes">
      {questions.map((question) => (
        <div key={question.id} className="question">
          <div className="question-text">{question.text}</div>
          <div className="options">
            {question.options.map((option) => (
              <button onClick={() => console.log('Button clicked')}>Test Click</button>
              /* <button
              key={option}
              className={`option-button ${selectedOptions[question.id]?.includes(option) ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(question.id, option)}
            >
              {option}
            </button> */
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DentalNotes;
