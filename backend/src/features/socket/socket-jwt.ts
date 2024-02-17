'use strict';

import { Server, Socket } from 'socket.io';
import { show } from '../../core/config';

/**
 * Initializes socket.io event listeners.
 * @param io - The socket.io server instance.
 */
const init = (io: Server): void => {
  io.on('connection', (socket: Socket): void => {
    show.debug('[SOCKET] Client connected!');

    socket.on('namespace', (message: object): void => {
      show.debug('[NAMESPACE]', message);
    });

    // Fixed missing closing parenthesis and curly brace here
    socket.on('selectExaminationOption', (selection: any): void => {
      console.log('Selection received:', selection);
      // Process the selection, generate notes, etc.

      // Broadcast the update to all clients (or specific ones based on your logic)
      io.emit('updateExamination', { updatedData: 'Example data based on selection' });
    }); // Added closing parenthesis and curly brace

    socket.on('disconnect', (): void => {
      show.debug('[SOCKET] Client disconnected!');
    });
  });
};

export default {
  init,
};
