'use strict'
import { Schema } from 'mongoose'


// Be the same as in the backend
interface UserResponse {
  id: Schema.Types.ObjectId,
  email: string
  created: string
  updated: string
}

export type { UserResponse }
