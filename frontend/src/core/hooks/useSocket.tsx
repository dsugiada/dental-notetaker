import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import useConfig from './useConfig';

const useSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { getBaseUrl } = useConfig();

  const url = getBaseUrl();

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
  }, [userId, url]); // Only re-run if userId changes

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