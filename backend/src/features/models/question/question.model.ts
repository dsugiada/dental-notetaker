'use strict';

import mongoose from 'mongoose';
const { Schema } = mongoose;

const optionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  // Additional fields as needed
}, { _id: false });

const questionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  options: [optionSchema],
  // Additional fields as needed
});

export default mongoose.model('Question', questionSchema);