'use strict'

import express from 'express'
import auth from '../../../auth/auth'
const router = express.Router()
import patient from './index'

router.get('/retrieve', auth.protect, patient.get)
router.post('/add', auth.protect, patient.add)
router.post('/remove', auth.protect, patient.remove)

export default router
