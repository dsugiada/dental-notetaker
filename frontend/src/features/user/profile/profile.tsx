import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RootState } from '../../../core/store/store';
import { authSlice } from '../../auth/auth';
import './profile.scss';

interface Question {
  id: number;
  text: string;
  options: string[];
}

// Define your user type based on your state structure
interface User {
  id: string;
}

interface UserResponse {
  id: string;
  // other properties
}


const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl: string = useSelector((state: RootState) => state.home.apiUrl);
  const user: User = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');
  const [userData, setUserData] = useState<any>({});
  const [questions, setQuestions] = useState<Question[]>([]);

  const user_role = "admin";

  // Define the expected structure for your state selectors
  useEffect(() => {
      fetchQuestions();
      checkProfile();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchQuestions = async () => {
    if (user_role === 'admin') {
      try {
        setLoading(true);
        setLoadingMessage('Loading questions...');
        const response = await axios.get(`${apiUrl}/questions/retrieve`);
        setQuestions(response.data);
        console.log(response)
      } catch (error) {
        console.error('Failed to load questions', error);
        toast.warn('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
  }

  const checkProfile = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Loading profile...');
      const data = { id: user.id };
      const response = await axios.post(`${apiUrl}/user/profile/check`, data);
      setUserData(response.data.result);
    } catch (error) {
      console.error('Profile check failed', error);
      toast.warn('Profile check failed!');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/error/unauthorized');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRemove: () => Promise<void> = async () => {
    try {
      setLoading(true)
      setLoadingMessage('Removing account...')
      const data = { id: user.id }
      await axios.post(`${apiUrl}/user/profile/remove`, data)
      toast.success('Account removed successfully!')
      dispatch(authSlice.actions.setUser(false))
      navigate('/')
    } catch (err) {
      console.warn(err)
      toast.warn('Account remove failed!')
    }
  }

  // Functions to handle adding and removing questions
  // These should be properly implemented based on your backend API
  const handleAddQuestion = () => {
    // Logic to open add question modal or form
    // This might involve setting a state to show a modal, for example
  };

  const handleRemoveQuestion = async (questionId: number) => {
    // Removal logic here
  };

  return (
    <div className="profile-container animate__animated animate__fadeIn animate__delay-1s">
      <div className="content">
        <div className="title">
          <FontAwesomeIcon className="icon" icon={faUser} />
          Profile
        </div>
        {loading ? (
          <div className="loader">
            <CircularProgress />
            <p>{loadingMessage}</p>
          </div>
        ) : (
          <>
            <div className="text">
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
            <div className="button-remove" onClick={onRemove}>
              Remove account
            </div>
            {user_role === 'admin' && (
              <>
                <div className="admin-actions">
                  <button onClick={handleAddQuestion}>Add Question</button>
                </div>
                <div className="questions-list">
                  {questions.map((question) => (
                    <div key={question.id} className="question-item">
                      <div className="question-text">{question.text}</div>
                      <div className="actions">
                        <button onClick={() => handleRemoveQuestion(question.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;