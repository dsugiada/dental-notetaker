'use strict'

import { Express } from 'express'

import homeRoute from '../../features/home/home.routes'
import authRoute from '../../features/auth/auth/auth.routes'
import docsRoute from '../../features/docs/docs.routes'
import { error } from './index'

//model routes
import userRoute from '../../features/models/user/user.routes'
import questionRoute from '../../features/models/question/question.routes'
import examRoute from '../../features/models/examination/examination.routes'
import clincianRoute from '../../features/models/user/clinician/clinician.routes'
import patientRoute from '../../features/models/user/patients/patient.routes'

/**
 * Initializing routes
 * @param app Express
 */
const init = (app: Express) => {
  app.use('/', homeRoute)
  app.use('/api/auth', authRoute)
  app.use('/api/user', userRoute)
  app.use('/api/docs', docsRoute)
  app.use('/api/questions', questionRoute)
  app.use('/api/examinations',examRoute)
  app.use('/api/clinician',clincianRoute)
  app.use('/api/patient',patientRoute)
  app.use('*', error.routing)
  app.use(error.internal)
}

export default {
  init,
}
