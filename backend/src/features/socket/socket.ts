'use strict'

import { show } from '../../core/config'

/**
 * Socket connection
 * @param io object
 */
const init = (io: any): void => {
  show.debug('[SOCKET] Server started')
  io.on('connection', (socket: any): void => {
    show.debug('[SOCKET] Client connected!')

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