import { Request, Response } from 'express';
import Examination from '../models/examination'; // Adjust the import path as necessary

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

    // Find or create an examination record for the clinician
    let examination = await Examination.findOne({ clinicianId });

    if (!examination) {
      examination = new Examination({ clinicianId, patientRecords: [] });
    }

    // Attempt to find the patient record
    let patientRecord = examination.patientRecords.find(record => record.patientId.equals(patientId));

    if (!patientRecord) {
      patientRecord = { patientId, selections: [] };
      examination.patientRecords.push(patientRecord);
    }

    // Update or add the selection
    const selectionIndex = patientRecord.selections.findIndex(selection => selection.questionId.equals(questionId));

    if (selectionIndex > -1) {
      patientRecord.selections[selectionIndex].selectedOptions = selectedOptions;
    } else {
      patientRecord.selections.push({ questionId, selectedOptions });
    }

    await examination.save();
    return res.status(200).json({ message: 'Selection saved successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: 'Failed to save selection', error: error.message });
  }
};

export default saveSelection;
