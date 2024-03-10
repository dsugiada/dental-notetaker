'use strict'

import mongoose from 'mongoose'
const { Schema } = mongoose

/**
 * Create schema
 */
const schema: mongoose.Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 100,
  },
  name: {
    type: String,
    minlength: 5,
    maxlength: 100,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1000,
  },
  salt: {
    type: String,
    minlength: 5,
    maxlength: 20,
  },
  active: {
    type: Boolean,
    default: false,
  },
  activationCode: {
    type: String,
    default: '',
  },
  recoveryCode: {
    type: String,
    default: '',
  },
  refreshToken: {
    token: {
      type: String,
      minlength: 5,
      maxlength: 1000,
    },
    expiration: {
      type: String,
      minlength: 5,
      maxlength: 500,
    },
  },
  created: {
    type: Date,
    required: true,
  },
  updated: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'clinician', 'admin', 'user'],
    default: 'user'
  },
  profile: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'roleProfiles',
  },
  roleProfiles: {
    type: String,
    required: true,
    enum: ['Patient', 'Clinician'], // Corresponding model names for refPath
  },
})

/**
 * Create a model using the schema
 */
export default mongoose.model('user', schema, 'user')
