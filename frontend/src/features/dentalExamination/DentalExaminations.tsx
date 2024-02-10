import React, { useState } from 'react';
import useSocket from './core/hooks/useSocket';
import './DentalExamination.scss';

const questions = [
  {
    id: 1,
    text: "Question 1",
    options: ["Option 1", "Option 2", "Option 3"],
  },
  // Add more questions as needed
];

const DentalExamination = () => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionSelect = (questionId, option) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: option }));
    // Here, you would also emit the selection to the server via socket.io
  };

  const { send, socket } = useSocket();

  useEffect(() => {
    // Listen for real-time updates
    socket.on('updateExamination', (data) => {
      console.log('Examination data updated', data);
      // Handle the updated examination data here
    });
  }, [socket]);

  const handleSelectionChange = (selection) => {
    // Send the selection to the server
    send('selectExaminationOption', selection);
  };

  return (
    <div>
      {/* Render your examination options here */}
      <button onClick={() => handleSelectionChange({ option: 'Example Option' })}>Select Option</button>
    </div>
  );

  return (
    <div className="dental-examination">
      {questions.map((question) => (
        <div key={question.id} className="question">
          <div className="question-text">{question.text}</div>
          <div className="options">
            {question.options.map((option) => (
              <button
                key={option}
                className={`option-button ${selectedOptions[question.id] === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(question.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DentalExamination;
