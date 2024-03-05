'use strict'

import { show } from '../../core/config'
import mongoose from 'mongoose';

/**
 * Socket connection
 * @param io object
 */
const init = (io: any): void => {
  show.debug('[SOCKET] Server started')
  io.on('connection', (socket: any): void => {
    show.debug('[SOCKET] Client connected!')

    // Define the change stream
    const changeStream = mongoose.connection.collection('userInteractions').watch();

    changeStream.on('change', (change) => {
      console.log('[Change Stream] Change detected:', change);
      // Emit changes to all connected clients
      io.emit('updateState', change);
    });


    socket.on('namespace', (message: object): void => {
      show.debug(message)
    })

    socket.on('selectExaminationOption', (data: any) => {
      show.debug('Option selected', data);
      io.emit('updateExamination', data); // Emit to all clients
  });

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