'use strict';

import show from './logging';
import socket from '../../../features/socket';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = {};

/**
 * Start socket.io server
 * @param server object
 */
const listen = (server: object): boolean => {
  try {
    io = new Server(server, {
      cors: {
        origin: "*", // Adjust according to your CORS policy
      },
    });

    // Middleware for socket authentication
    io.use((socket, next) => {
      const token = socket.handshake.auth.token; // Expecting token to be sent in the handshake auth object
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return next(new Error('Authentication error'));
          }
          socket.userId = decoded.id; // Adjust based on your token payload structure
          next();
        });
      } else {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      show.debug('[SOCKET] Client connected:', socket.id);

      // Join the socket to a room named after the user's ID
      socket.join(socket.userId);

      // Example of handling a custom event
      socket.on('selection', (data) => {
        // Emit to all other sockets in the same room (user ID)
        io.to(socket.userId).emit('selection', data);
      });

      // Your existing socket.init logic here, if needed
      socket.init(io);
    });

    show.debug('[SOCKET] Server started');
    return true;
  } catch (err) {
    const error = err.toString();
    show.debug(error);
    return false;
  }
};

/**
 * Close socket.io server
 */
const close = (): boolean => {
  try {
    io.close();
    show.debug('[SOCKET] Server closed');
    return true;
  } catch (err) {
    const error = err.toString();
    show.debug(error);
    return false;
  }
};

export default {
  listen,
  close,
};
