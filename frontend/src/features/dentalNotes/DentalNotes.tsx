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
              <div className="question-text">{question.text}</div>
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


        <div className="text">
          Thanks for using my boilerplate, find some details below to get
          started.
        </div>
        <div className="text">
          Like the project? Show some support at{' '}
          <a
            className="link"
            target="_blank"
            rel="noreferrer"
            href="https://ko-fi.com/tamas0547"
          >
            ko-fi
          </a>
          . <FontAwesomeIcon className="icon" icon={faThumbsUp} />
          <br />
          Don't forget to give it a star on{' '}
          <a
            className="link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/tamasszoke/mern-seed"
          >
            GitHub
          </a>
          . <FontAwesomeIcon className="icon" icon={faStar} />
        </div>
        <div className="title">
          <FontAwesomeIcon className="icon" icon={faFileAlt} />
          Summary
        </div>
        <div className="text">
          As you probably know, it uses Node, Mocha, MongoDB on the backend, and
          React, Jest, Cypress on the frontend. Both sides are armed with
          TypeScript and packed with Docker. Using JWT for authentication and
          authorization.
        </div>
        <div className="title">
          <FontAwesomeIcon className="icon" icon={faFileAlt} />
          Documentation
        </div>
        <div className="text">
          See the readme for the complete documentation. It also includes
          development practices, guidelines, and conventions.{' '}
          <a
            className="link"
            href="https://github.com/tamasszoke/mern-seed#readme"
          >
            https://github.com/tamasszoke/mern-seed#readme
          </a>
        </div>
        <div className="title">
          <FontAwesomeIcon className="icon" icon={faFileAlt} />
          Credits
        </div>
        <div className="text">
          <p>Made by Tamas Szoke @ 2022</p>
        </div>
      </div>
    </div>
  )
}

export default DentalNotes
