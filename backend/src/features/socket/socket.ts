'use strict'

import { show } from '../../core/config'
import { Server, Socket } from 'socket.io';

/**
 * Socket connection
 * @param io object
 */
const init = (io: Server): void => {
  show.debug('[SOCKET] Server started')
  io.on('connection', (socket: Socket): void => {
    show.debug('[SOCKET] Client connected!')

    // Assuming `userId` is attached to the socket in the authentication middleware.
    const userId = (socket as any).userId;

    socket.on('namespace', (message: object): void => {
      show.debug('[NAMESPACE]', message)
    })

    // Join the socket to a room named after the user's ID
    if (userId) {
      socket.join(userId);

      socket.on('selectExaminationOption', (data: any): void => {
        show.debug('Option selected', data);
        io.emit('updateExamination', data); // Emit to all clients
      });
    }
    
    socket.on('disconnect', (): void => {
      show.debug('[SOCKET] Client disconnected!')
    })
  })
}

export default {
  init,
}

/**
 * https://socket.io/docs/emit-cheatsheet/
 */