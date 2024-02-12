'use strict';

import show from './logging';
// Assuming `socket` is meant to initialize socket.io logic specific to your application.
// Ensure this module exports a function that accepts a Server instance if you intend to call `socket.init(io);`
import socket from '../../../features/socket';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: Server; // Declare io at a shared scope

/**
 * Start socket.io server
 * @param server - The HTTP or HTTPS server instance.
 */
const listen = (server: any): boolean => { // Changed type to 'any' to accommodate HTTP/HTTPS server types. For more accuracy, use specific types from 'http' or 'https' modules.
  try {
    const io = new Server(server, {
      cors: {
        origin: "*", // Adjust according to your CORS policy
      },
    });

    // Middleware for socket authentication
    io.use((socket: Socket, next: (err?: Error) => void) => {
      const token = socket.handshake.auth.token; // Expecting token to be sent in the handshake auth object
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => { // Added missing function brackets and typed 'decoded' as 'any' for simplicity.
          if (err) {
            return next(new Error('Authentication error'));
          } else if (decoded) {
            // Assuming you want to attach the userId to the socket for later use.
            // This requires extending the Socket type or using a custom interface.
            (socket as any).userId = decoded.id; // Adjust based on your token payload structure
            next();
          }
        });
      } else {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket: Socket) => {
      show.debug('[SOCKET] Client connected:', socket.id);

      // Assuming `userId` is attached to the socket in the authentication middleware.
      const userId = (socket as any).userId;

      // Join the socket to a room named after the user's ID
      if (userId) {
        socket.join(userId);

        // Example of handling a custom event
        socket.on('selection', (data: any) => { // Typed 'data' as 'any'. Specify a more precise type if known.
          // Emit to all other sockets in the same room (user ID)
          io.to(userId).emit('selection', data);
        });
      }

      // Your existing socket.init logic here, if needed
      // Ensure the 'socket' module exports a function named 'init' that accepts a Server instance.
      // socket.init(io); // Commented out due to potential misunderstanding of its purpose.
    });

    show.debug('[SOCKET] Server started');
    return true;
  } catch (err: any) { // Typed 'err' as 'any' to allow property access without type assertion.
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
  } catch (err: any) { // Typed 'err' as 'any'.
    const error = err.toString();
    show.debug(error);
    return false;
  }
};

export default {
  listen,
  close,
};