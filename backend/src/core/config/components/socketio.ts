'use strict'

import show from './logging'
import socket from '../../../features/socket'
import { corsOptions } from './express'
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: Server;

/**
 * Start socket.io server
 * @param server object
 */

const listen = (server: object): boolean => {
  try {
    io = new Server(server, { cors: corsOptions });
    socket.init(io)
    
    // Middleware for socket authentication
    io.use((socket: Socket, next: (err?: Error) => void) => {
      const token = socket.handshake.auth.token; // Expecting token to be sent in the handshake auth object
      console.log(token)
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
    return true
  } catch (err: any) {
    const error = err.toString()
    show.debug(error)
    return false
  }
}

/**
 * Close socket.io server
 */
const close = (): boolean => {
  try {
    io.close()
    show.debug('[SOCKET] Server closed')
    return true
  } catch (err: any) {
    const error = err.toString()
    show.debug(error)
    return false
  }
}

export default {
  listen,
  close,
}