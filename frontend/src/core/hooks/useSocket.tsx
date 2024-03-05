import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import useConfig from './useConfig';
import { verifyAuthentication } from '../../features/auth/verify/verify';

interface UseSocketReturn {
  socket: Socket | null;
  send: (channel: string, message: string | object) => void;
}

const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { getApiUrl } = useConfig();

  useEffect(() => {
    const initSocket = async () => {
      const isAuthenticated = await verifyAuthentication();
      console.log(isAuthenticated); //-> verified as true
      if (isAuthenticated) {
        const newSocket = io('https://localhost:3001', { transports: ['websocket'] });
        setSocket(newSocket);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Add dependencies if necessary

  const send = (channel: string, message: string | object) => {
    if (socket) {
      console.log('Send function working');
      socket.emit(channel, message);
    }
  };

  return { socket, send };
};

export default useSocket;






// const useSocket = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const { getBaseUrl } = useConfig(); // Call useConfig here at the top level
//   const url = "https://localhost:3001" //getBaseUrl();

//   const initSocket = async () => {
//     const isAuthenticated = await verifyAuthentication();
//     //console.log(isAuthenticated); -> verified as true
//     if (isAuthenticated) {
//       //console.log(url) -> verified as https://localhost:3001
//       const newSocket = io(url, {
//         transports: ["websocket"],
//         withCredentials: true, // Ensure credentials are sent with the connection
//       });

//       console.log(url)
//       /**
//        * Send message
//        * @param channel string
//        * @param message string/object
//        */

//       const send = (event: string, data: any) => {
//         if (socket) {
//           console.log('Send function working');