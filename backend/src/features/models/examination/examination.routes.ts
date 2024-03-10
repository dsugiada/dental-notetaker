'use strict'

import express from 'express'
import auth from '../../auth/auth'
const router = express.Router()
import examination from './index'

router.get('/retrieve', auth.protect, examination.getSections)
router.post('/saveselections', auth.protect, examination.saveSelections)
router.post('/remove', auth.protect, examination.removeSelections)

export default router
