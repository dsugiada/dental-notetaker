'use strict'

import express from 'express'
import auth from '../../auth/auth'
const router = express.Router()
import examination from './index'

router.get('/getSelections', auth.protect, examination.getSelections);
router.post('/saveSelections', auth.protect, examination.saveSelections)
router.post('/remove', auth.protect, examination.removeSelections)

export default router
