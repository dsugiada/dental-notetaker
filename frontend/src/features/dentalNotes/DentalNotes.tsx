import React, { useState, useEffect } from 'react';
import './DentalNotes.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faHome, faStar, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import useSocket from '../../core/hooks/useSocket';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RootState } from '../../core/store/store';

interface Question {
  _id: string;
  text: string;
  options: { text: string }[];
  single: boolean;
}

const DentalNotes: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const apiUrl = useSelector((state: RootState) => state.home.apiUrl);
  const theme = useSelector((state: RootState) => state.home.theme);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  // Accessing userId from Redux store
  //const userId = useSelector((state: RootState) => state.user.user?.id) || 'defaultUserId';
  const userId = "65c9c656703608f3856be2af";
  console.log(userId)

  const { send, socket } = useSocket(userId);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/questions/retrieve`);
        setQuestions(response.data.result);
      } catch (error) {
        console.error('Failed to load questions', error);
        toast.warn('Failed to load questions');
      }
    };

    fetchQuestions();
  }, [apiUrl]);

  useEffect(() => {
    const handleExaminationOptionSelected = (data: { userId: string; questionId: string | number; selected: any; option: string; }) => {
      console.log('Received data on private channel:', data);
      setSelectedOptions(prev => {
        const newSelections = { ...prev };
        const currentSelections = new Set(newSelections[data.questionId] || []);

        if (data.selected) {
          currentSelections.add(data.option);
        } else {
          currentSelections.delete(data.option);
        }

        newSelections[data.questionId] = Array.from(currentSelections);
        return newSelections;
      });
    };

    socket?.on('examinationOptionSelected', handleExaminationOptionSelected);

    return () => {
      socket?.off('examinationOptionSelected', handleExaminationOptionSelected);
    };
  }, [socket, userId]);

  const handleOptionSelect = (patientId: string, questionId: string, option: string, singleSelect: boolean) => {
    setSelectedOptions(prev => {
      const updated = { ...prev };
      const selections = singleSelect ? new Set<string>() : new Set<string>(updated[questionId] || []);

      if (selections.has(option)) {
        selections.delete(option);
      } else {
        selections.add(option);
      }

      updated[questionId] = Array.from(selections);

      send('selectExaminationOption', {
        userId,
        patientId,
        questionId,
        option,
        selected: selections.has(option)
      });

      return updated;
    });
  };

  return (
    <div className={`home-container animate__animated animate__fadeIn animate__delay-1s ${theme}`}>
      <div className="content">
        {/* Content */}
        <div className="dental-notes">
          {questions.map(question => (
            <div key={question._id} className="question">
              <div className="title">{question.text}</div>
              <div className="options">
                {question.options.map((option, index) => {
                  const isSelected = selectedOptions[question._id]?.includes(option.text);
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect("test", question._id, option.text, question.single)}
                      className={`option-button ${isSelected ? 'selected' : ''}`}
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
  );
};

export default DentalNotes;