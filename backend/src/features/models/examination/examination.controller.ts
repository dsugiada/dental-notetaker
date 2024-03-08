import { Request, Response } from 'express';
import Examination from './examination.model'; // Adjust the import path as necessary
import Question from '../question/question.model'; // Ensure this path is correct

// Define interfaces for your request body
interface SaveSelectionRequestBody {
  clinicianId: string;
  patientId: string;
  questionId: string;
  selectedOptions: string[];
}

const saveSelection = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { clinicianId, patientId, questionId, selectedOptions } = req.body as SaveSelectionRequestBody;

    // Validate the existence of the questionId in the Question collection
    const questionExists = await Question.findById(questionId);
    if (!questionExists) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Find or create an examination record for the clinician and patient
    let examination = await Examination.findOne({ clinicianId, 'patientRecords.patientId': patientId });

    if (!examination) {
      examination = new Examination({ clinicianId, patientRecords: [{ patientId, selections: [] }] });
    } else {
      // Check if patientRecord already exists for this examination
      let patientRecord = examination.patientRecords.find((record: { patientId: { equals: (arg0: string) => any; }; }) => record.patientId.equals(patientId));
    
      if (!patientRecord) {
        patientRecord = { patientId, selections: [] };
        examination.patientRecords.push(patientRecord);
      }
    }
    
    // Attempt to find or create the selection for the patient record
    const patientRecordIndex = examination.patientRecords.findIndex((record: { patientId: { equals: (arg0: string) => any; }; }) => record.patientId.equals(patientId));
    const selectionIndex = examination.patientRecords[patientRecordIndex].selections.findIndex((selection: { questionId: { equals: (arg0: string) => any; }; }) => selection.questionId.equals(questionId));
    
    if (selectionIndex > -1) {
      examination.patientRecords[patientRecordIndex].selections[selectionIndex].selectedOptions = selectedOptions;
      } else {
        examination.patientRecords[patientRecordIndex].selections.push({ questionId, selectedOptions });
      }
    
      await examination.save();
      return res.status(200).json({ message: 'Selection saved successfully' });
  } catch (error: unknown) {
    // Log the error for debugging purposes
    const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
    console.error(message);
    return res.status(500).json({ message: 'Failed to save selection', error: message });
}
};
    
export default saveSelection;