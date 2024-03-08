'use strict'

import express from 'express'
import auth from '../../auth/auth'
const router = express.Router()
import question from './index'

router.get('/retrieve', auth.protect, question.get)
router.put('/add', auth.protect, question.add)
router.post('/remove', auth.protect, question.remove)

export default router
