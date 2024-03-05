import axios from 'axios';

export const verifyAuthentication = async () => {
  try {
    const response = await axios.get(`https://localhost:3001/api/auth/local/check`, { withCredentials: true });
    //const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/local/check`, { withCredentials: true });
    console.log('[AUTH][VERIFIED]')
    return response.data.result.token;
  } catch (error) {
    console.error('Authentication verification failed', error);
    return false;
  }
};