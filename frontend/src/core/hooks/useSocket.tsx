import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useConfig from './useConfig';
//import { getCookie } from 'typescript-cookie';
//import Cookies from 'js-cookie';
import { verifyAuthentication } from '../../features/auth/verify/verify';


const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { getBaseUrl } = useConfig(); // Call useConfig here at the top level
  const url = "https://localhost:3001" //getBaseUrl();

  useEffect(() => {
  //   //const token = getCookie('token');
  //   //const token = Cookies.get('token');

  //   //console.log(token)

  //   if (token) {
  //     // Establish a socket connection with authentication token if the user is logged in
  //     const newSocket = io(url, {
  //       transports: ["websocket"],
  //       auth: { token },
  //     });

  //     newSocket.on('connect', () => console.log('Connected to socket server with token'));
  //     newSocket.on('connect_error', (error) => console.error('Socket connection error with token:', error));

  //     setSocket(newSocket);

  //     return () => {
  //       newSocket.disconnect();
  //     };
  //   } else {
  //     // Optionally handle the case where there is no token/user is not logged in
  //     console.log('No token found, not connecting to socket server');
  //   }
  // }, [url]); // Add url to the dependency array to re-run the effect if the URL changes

    const initSocket = async () => {
      const isAuthenticated = await verifyAuthentication();
      if (isAuthenticated) {
        console.log(url)
        const newSocket = io(url, {
          transports: ["websocket"],
          withCredentials: true, // Ensure credentials are sent with the connection
        });

        newSocket.on('connect', () => console.log('Connected to socket server'));
        newSocket.on('connect_error', (error) => console.error('Socket connection error:', error));

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
        };
      } else {
        console.log('User not authenticated, not connecting to socket server');
      }
    };

    initSocket();
  }, [url]);

  const send = (event: string, data: any) => {
    if (socket) {
      console.log(`Emitting event: ${event}`, data);
      socket.emit(event, data);
    } else {
      console.log('Socket not initialized, cannot emit event');
    }
  };

  return { send, socket };
};

export default useSocket;