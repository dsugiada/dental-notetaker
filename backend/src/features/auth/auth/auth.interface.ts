'use strict'
import { Schema } from 'mongoose'


// Be the same as in the backend
interface UserResponse {
  id: Schema.Types.ObjectId,
  email: string
  active: boolean
  created: string
  updated: string
}

interface UserData {
  email: string
  password: string
  salt?: string
  activationCode?: string
  created?: string
  updated?: string
}

export { UserResponse, UserData }
