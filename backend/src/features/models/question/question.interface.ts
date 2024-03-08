import { Document, ObjectId } from 'mongoose';

interface Option {
  text: string;
  // Add any additional fields here, if needed
}

// If you are using Mongoose's "_id" field on the option, you'd extend from Document
// If not, you can just use the interface Option as shown above.
//interface OptionDocument extends Option, Document {}

interface Question {
  text: string;
  options: Option[];
  created: Date;
  // Add any additional fields here, if needed
}

// If your Question model makes use of Mongoose's built-in "_id", "timestamps", etc.,
// You should extend from Document.
interface QuestionDocument extends Question, Document {}

export { Option, Question, QuestionDocument };
