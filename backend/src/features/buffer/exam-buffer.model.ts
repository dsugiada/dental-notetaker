'use strict';

import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define a schema for question selections within an examination.
const selectionSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId, // Reference to the Question model, if exists
    required: true,
    ref: 'Question', // Optional: Only if you have a separate Question collection
  },
  selectedOptions: [{
    type: String, // Assuming options are identified by some string identifier
    required: true,
  }],
}, { _id: false, timestamps: false }); // Disable _id for subdocument and timestamps if not needed

// Create schema for examinations.
const examinationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Reference to the User model
    required: true,
    ref: 'User',
  },
  email: { // Optional, consider removing if userId suffices for identification
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  selections: [selectionSchema], // Embed the selection schema
}, { timestamps: true }); // Use MongoDB's built-in support for timestamps

// Create a model using the schema
const Examination = mongoose.model('Examination', examinationSchema);

export default Examination;
