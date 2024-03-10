'use strict';

import mongoose from 'mongoose';
const { Schema } = mongoose;


const selectionSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  selectedOptions: [{
    type: String,
    required: true,
  }],
}, { _id: false });

const patientRecordSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Patient', // Assuming you have a Patient model
  },
  selections: [selectionSchema],
}, { _id: false });

const examinationSchema = new Schema({
  clinicianId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Assuming clinicians are stored in the User model
  },
  patientRecords: [patientRecordSchema],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Examination', examinationSchema, 'examinations');