// src/core/hooks/useSocket.tsx
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    const newSocket = io(process.env.REACT_APP_BACKEND_URL!, {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => console.log('Connected to socket server'));

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const send = (event: string, data: any) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  return { send, socket };
};

export default useSocket;
