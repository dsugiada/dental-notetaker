'use strict';

import { Document, ObjectId } from 'mongoose';

interface Selection {
  questionId: ObjectId;
  selectedOptions: string[];
}

interface PatientRecord {
  patientId: {
    type: string
  };
  selections: string[];
}

interface Examination extends Document {
  userId: ObjectId;
  email: string;
  selections: Selection[];
}

export { Selection, PatientRecord, Examination };
