'use strict'

import mongoose from 'mongoose'
const { Schema } = mongoose

// Clinician model
  const clinicianSchema = new Schema({
    // Clinician-specific fields
    specialty: { type: String },
    assignedPatients: [{
      type: Schema.Types.ObjectId,
      ref: 'Patient',
    }],
  });
  
  export default mongoose.model('Clinician', clinicianSchema);
  