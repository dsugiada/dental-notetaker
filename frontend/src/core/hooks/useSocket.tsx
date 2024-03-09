import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import useConfig from './useConfig';

const useSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { getApiUrl } = useConfig();
  const url = 'https://localhost:3001' //getApiUrl(); // This should come from a config or environment variable

  useEffect(() => {
    // Create a socket instance when the hook is run for the first time
    const newSocket = io(url, {
      transports: ['websocket'],
      query: { userId },
    });

    setSocket(newSocket);

    // Join the private channel immediately after the socket is created
    newSocket.emit('joinPrivateChannel', userId);
    console.log(`Joining with userId: ${userId}`);

    // Define cleanup logic for when the component using this hook unmounts or if userId changes
    return () => {
      newSocket.emit('leavePrivateChannel', userId);
      newSocket.disconnect();
    };
  }, [userId]); // Only re-run if userId changes

  // Define a function for sending messages
  const send = (channel: string, message: string | object) => {
    if (socket) {
      socket.emit(channel, message);
    }
  };

  // Return the socket instance and the send function
  return { socket, send };
};

export default useSocket;


// import { useState, useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';
// import useConfig from './useConfig';
// import { verifyAuthentication } from '../../features/auth/verify/verify';

// interface UseSocketReturn {
//   socket: Socket | null;
//   send: (channel: string, message: string | object) => void;
// }

// const useSocket = (): UseSocketReturn => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   //const { getApiUrl } = useConfig();

//   useEffect(() => {
//     const initSocket = async () => {
//       const token = await verifyAuthentication();
//       //console.log(token); //-> verified as true
//       if (token) {
//         const newSocket = io('https://localhost:3001', { 
//           transports: ['websocket'],
//            auth: {
//              token: token
//            } 
//         });
//         setSocket(newSocket);
//       }
//     };

//     initSocket();

//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []); // Add dependencies if necessary

//   const send = (channel: string, message: string | object) => {
//     if (socket) {
//       //console.log('Send function working');
//       socket.emit(channel, message);
//     }
//   };

//   return { socket, send };
// };

// export default useSocket;