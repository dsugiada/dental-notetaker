'use strict'

import { show } from '../../core/config'

/**
 * Socket connection
 * @param io object
 */
const init = (io: any): void => {
  io.on('connection', (socket: any): void => {
    show.debug('[SOCKET] Client connected!')

    // Handle joining a clinician-private channel upon joining
    socket.on('joinPrivateChannel', (userId: string): void => {
      const channel = `private-${userId}`
      socket.join(channel)
      show.debug(`[SOCKET] Client joined private channel: ${channel}`)
    })

    // Handle leaving a clinician-private channel upon joining
    socket.on('leavePrivateChannel', (userId: string): void => {
      const channel = `private-${userId}`
      socket.leave(channel)
      show.debug(`[SOCKET] Client left private channel: ${channel}`)
    })

    socket.on('disconnect', (): void => {
      show.debug('[SOCKET] Client disconnected!')
    })


    socket.on('selectExaminationOption', (data: any) => {
      const { userId, patientId } = data; // Extract userId from the data payload
        const channel = patientId ? `private-${userId}-${patientId}` : `private-${userId}`;
        show.debug(`[SOCKET] Change emitted on: ${channel}`)
        io.to(channel).emit('examinationOptionSelected', data);
    });
  })
}

export default {
  init,
}


// 'use strict'

// import { show } from '../../core/config'
// import mongoose from 'mongoose';

// /**
//  * Socket connection
//  * @param io object
//  */
// const init = (io: any): void => {
//   show.debug('[SOCKET] Server started')
//   io.on('connection', (socket: any): void => {
//     show.debug('[SOCKET] Client connected!')

//      // Define the change stream
//      const changeStream = mongoose.connection.collection('examination').watch();
//      //console.log(changeStream)
//      changeStream.on('change', (change) => {
//        console.log('[Change Stream] Change detected:', change);
//        // Emit changes to all connected clients
//        io.emit('updateState', change);
//      });

//     // const changeStream = mongoose.connection.collection('examinations').watch([
//     //   { $match: { 'fullDocument.userId': userId } }
//     // ]);
    
//     // changeStream.on('change', (change) => {
//     //   console.log('[Change Stream] Change detected:', change);
//     //   // Emit changes to the connected client
//     //   socket.emit('updateState', change.fullDocument);
//     // });    

//     socket.on('namespace', (message: object): void => {
//       show.debug(message)
//     })

//     socket.on('selectExaminationOption', (data: any) => {
//       show.debug('Option selected', data);
//       io.emit('updateExamination', data); // Emit to all clients
//   });

//     socket.on('disconnect', (): void => {
//       show.debug('[SOCKET] Client disconnected!')
//     })
//   })
// }

// export default {
//   init,
// }

// /**
//  * https://socket.io/docs/emit-cheatsheet/
//  */