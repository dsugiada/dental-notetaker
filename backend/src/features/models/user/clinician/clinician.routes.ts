'use strict'

import express from 'express'
import auth from '../../../auth/auth'
const router = express.Router()
import clinician from './index'
import clinicianController from './clinician.controller'; 

router.get('/retrieve', auth.protect, clinician.get)
router.put('/add', auth.protect, clinician.add)
router.post('/remove', auth.protect, clinician.remove)

router.get('/:userId/patients', auth.protect, clinician.getPatients);

export default router
