'use strict';

import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * Define a schema for question selections within an examination.
 * This subdocument will store question IDs and the selected options.
 */
const selectionSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId, // Assuming question IDs are MongoDB ObjectIds
    required: true,
  },
  selectedOptions: [{
    type: String, // Assuming options are identified by some string identifier
    required: true,
  }],
}, { _id: false }); // Disable _id for subdocument

/**
 * Create schema for examinations.
 * This document will store user examinations and their selections.
 */
const examinationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Reference to the User model
    required: true,
    ref: 'User',
  },
  email: { // Optional, if you want to quickly identify the user without populating the userId
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  selections: [selectionSchema], // Embed the selection schema
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Create a model using the schema
 */
export default mongoose.model('Examination', examinationSchema, 'examinations');
