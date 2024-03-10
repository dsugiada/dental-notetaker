'use strict'

import express from 'express'
import { Request, Response } from 'express';
import { settings, show } from '../../../core/config'
import { ClientError } from '../../../core/server/server.interface'
import { response } from '../../../core/server'
import Examination from './examination.model';
import Question from '../question/question.model';
import mongoose from 'mongoose';

// Define interfaces for your request body
interface SaveSelectionRequestBody {
  clinicianId: string;
  patientId: string;
  questionId: string;
  selectedOptions: string[];
}

/**
 * Get all question data
 * @param req object
 * @param res object
 * @param next object
 * @returns object
 */
const getSections = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<express.Response<any, Record<string, any>>> => {
  try {
    show.debug('[SELECTION][GET] Request')
    const result = await Examination.find({})
    if (!result.length) {
      throw new ClientError(1002, 'No questions found');
    } else {
      show.debug('[SELECTION][GET] Success');
      return response.send(res, 200, result, false);
    }
  } catch (err: any) {
    show.debug(`[SELECTION][GET] Error ${err.type} ${err.code} ${err.message}`);
    if (err.type === 'client') {
      return response.send(res, 400, false, err);
    } else {
      return response.send(res, 500, false, err);
    }
  }
};

const saveSelections = async (req: Request, res: Response): Promise<Response> => {
  try {
    show.debug('[SELECTION][SAVE] Request');
    const { clinicianId, patientId, questionId, selectedOptions } = req.body as SaveSelectionRequestBody;
    console.log(clinicianId, patientId, questionId, selectedOptions);

    // Validate the existence of the questionId in the Question collection
    const questionExists = await Question.findById(questionId);
    if (!questionExists) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Convert clinicianId to ObjectId
    const clinicianObjectId = new mongoose.Types.ObjectId(clinicianId);

    // Convert patientId to ObjectId
    console.log(clinicianObjectId)
    console.log(mongoose.isValidObjectId(patientId))
    const patientObjectId = new mongoose.Types.ObjectId(patientId);
    console.log(patientId)
    console.log(patientObjectId)
    // Find or create an examination record for the clinician and patient
    let examination = await Examination.findOne({ clinicianId: clinicianObjectId, 'patientRecords.patientId': patientObjectId });

    if (!examination) {
      // Create new examination if not found
      examination = new Examination({
        clinicianId: clinicianObjectId,
        patientRecords: [{ patientId, selections: [{ questionId, selectedOptions }] }]
      });
    } else {
      // Find existing patientRecord or create a new one
      let patientRecord = examination.patientRecords.find((record: { patientId: { equals: (arg0: mongoose.Types.ObjectId) => any; }; }) => record.patientId.equals(patientObjectId));

      if (!patientRecord) {
        patientRecord = { patientObjectId, selections: [{ questionId, selectedOptions }] };
        examination.patientRecords.push(patientRecord);
      } else {
        // Update existing selection or add a new selection
        const selection = patientRecord.selections.find((selection: { questionId: { equals: (arg0: string) => any; }; }) => selection.questionId.equals(questionId));

        if (selection) {
          selection.selectedOptions = selectedOptions;
        } else {
          patientRecord.selections.push({ questionId, selectedOptions });
        }
      }
    }

    // Save changes to the examination
    await examination.save();

    return res.status(200).json({ message: 'Selection saved successfully', examination });
  } catch (error: any) {
    // Log the error for debugging purposes
    const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
    show.debug(`[SELECTION][GET] Error ${error.type} ${error.code} ${error.message}`);
    return res.status(500).json({ message: 'Failed to save selection', error: message });
  }
};


// const saveSelections = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     show.debug('[SELECTION][SAVE] Request')
//     const { clinicianId, patientId, questionId, selectedOptions } = req.body as SaveSelectionRequestBody;
//     console.log(clinicianId, patientId, questionId, selectedOptions)
//     // Validate the existence of the questionId in the Question collection
//     const questionExists = await Question.findById(questionId);
//     if (!questionExists) {
//       return res.status(404).json({ message: 'Question not found' });
//     }

//     // Find or create an examination record for the clinician and patient
//     let examination = await Examination.findOne({ clinicianId, 'patientRecords.patientId': patientId });
//     console.log(examination)
//     if (!examination) {
//       examination = new Examination({ clinicianId, patientRecords: [{ patientId, selections: [] }] });
//       console.log("entered")
//     } else {
//       // Check if patientRecord already exists for this examination
//       let patientRecord = examination.patientRecords.find((record: { patientId: { equals: (arg0: string) => any; }; }) => record.patientId.equals(patientId));

//       if (!patientRecord) {
//         patientRecord = { patientId, selections: [] };
//         examination.patientRecords.push(patientRecord);
//       }
//     }


//     // Attempt to find or create the selection for the patient record
//     const patientRecordIndex = examination.patientRecords.findIndex((record: { patientId: { equals: (arg0: string) => any; }; }) => record.patientId.equals(patientId));
//     const selectionIndex = examination.patientRecords[patientRecordIndex].selections.findIndex((selection: { questionId: { equals: (arg0: string) => any; }; }) => selection.questionId.equals(questionId));

//     if (selectionIndex > -1) {
//       examination.patientRecords[patientRecordIndex].selections[selectionIndex].selectedOptions = selectedOptions;
//     } else {
//       examination.patientRecords[patientRecordIndex].selections.push({ questionId, selectedOptions });
//     }

//     await examination.save();
//     return response.send(res, 200, examination, false);
//     //return res.status(200).json({ message: 'Selection saved successfully' });
//   } catch (error: any) {
//     // Log the error for debugging purposes
//     const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
//     show.debug(`[SELECTION][GET] Error ${error.type} ${error.code} ${error.message}`);
//     return res.status(500).json({ message: 'Failed to save selection', error: message });
//   }
// };

/**
 * Remove user account
 * @param req object
 * @param res object
 * @param next object
 * @returns object
 */
const removeSelections = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<express.Response<any, Record<string, any>>> => {
  try {
    show.debug('[SELECTION][REMOVE] Request')
    const { id } = req.body
    if (!id) {
      throw new ClientError(1001, 'parameters not found')
    }
    const result = await Examination.findOneAndRemove({ _id: id })
    show.debug('[SELECTION][REMOVE] Success')
    if (!result) {
      throw new ClientError(1002, 'account not found')
    } else {
      return response.send(res, 200, result, false)
    }
  } catch (err: any) {
    show.debug(
      `[SELECTION][REMOVE] Error ${err.type} ${err.code} ${err.message}`
    )
    if (err.type === 'client') {
      return response.send(res, 400, false, err)
    } else {
      return response.send(res, 500, false, err)
    }
  }
}

export default {
  getSections,
  saveSelections,
  removeSelections,
}
