'use strict'

import mongoose from 'mongoose'
const { Schema } = mongoose

// Patient model
const patientSchema = new Schema({
    // Patient-specific fields
    medicalHistory: [{ type: String }],
    assignedClinicians: [{
      type: Schema.Types.ObjectId,
      ref: 'Clinician',
    }],
  });
  
  export default mongoose.model('Patient', patientSchema);