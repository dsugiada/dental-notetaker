import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import useConfig from './useConfig';
import { ObjectId } from 'mongoose';

const useSocket = (userId: ObjectId, patientId?: string, connect: boolean = false) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { getBaseUrl } = useConfig();
  const url = getBaseUrl();

  console.log(connect)
  useEffect(() => {
    if (connect) { //prevent immediate connection with this flag
      // Create a socket instance when the hook is run for the first time
      const newSocket = io(url, {
        transports: ['websocket'],
        query: { userId },
      });

      setSocket(newSocket);

      const channel = patientId ? `${userId}-${patientId}` : `${userId}`;
      newSocket.emit('joinPrivateChannel', channel);

      // Define cleanup logic for when the component using this hook unmounts or if userId changes
      return () => {
        newSocket.emit('leavePrivateChannel', userId);
        newSocket.disconnect();
      };

    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [userId, patientId, url, connect]); // Only re-run if userId changes

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