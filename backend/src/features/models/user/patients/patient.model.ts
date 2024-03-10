'use strict'

import mongoose from 'mongoose';
const { Schema } = mongoose;

// Patient model
const patientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  referenceNo: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Link to User model
    required: false // It might be false if the patient isn't also a user
  },
  assignedClinicians: [{
    type: Schema.Types.ObjectId,
    ref: 'User', // If your clinicians are stored in the 'User' collection
    required: true // Set to true if a clinician must be assigned upon creation
  }],
  medicalHistory: [{ type: String }], // Other fields as required
});

export default mongoose.model('Patient', patientSchema, 'patients');
