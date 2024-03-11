'use strict'

import express from 'express'
import { Request, Response } from 'express';
import { settings, show } from '../../../core/config'
import { ClientError } from '../../../core/server/server.interface'
import { response } from '../../../core/server'
import Examination from './examination.model';
import Question from '../question/question.model';
import mongoose, { Schema } from 'mongoose';
import { ParsedQs } from 'qs';

// Define interfaces for your request body
interface SaveSelectionRequestBody {
  clinicianId: Schema.Types.ObjectId;
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
const getSelections = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<express.Response<any, Record<string, any>>> => {
  try {
    const { clinicianId, patientId } = req.query; // Assuming these are passed as query parameters

    if (!clinicianId || !patientId) {
      return res.status(400).json({ message: 'Missing clinicianId or patientId' });
    }

    const examination = await Examination.findOne({
      clinicianId: clinicianId,
      'patientRecords.patientId': patientId
    }).exec();

    if (!examination) {
      return res.status(404).json({ message: 'Examination record not found' });
    }

    const patientRecord = examination.patientRecords.find((record: { patientId: { toString: () => string | string[] | ParsedQs | ParsedQs[]; }; }) => record.patientId.toString() === patientId);

    if (!patientRecord) {
      return res.status(404).json({ message: 'Patient record not found in examination' });
    }

    return res.status(200).json(patientRecord.selections);
  } catch (error) {
    console.error('Failed to get patient selections:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

const saveSelections = async (req: Request, res: Response): Promise<Response> => {
  try {
    show.debug('[SELECTION][SAVE] Request');
    const { clinicianId, patientId, questionId, selectedOptions } = req.body as SaveSelectionRequestBody;

    // Validate the existence of the questionId in the Question collection
    const questionExists = await Question.findById(questionId);
    if (!questionExists) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Convert clinicianId to ObjectId
    const clinicianObjectId = clinicianId;

    // Convert patientId to ObjectId
    const patientObjectId = new mongoose.Types.ObjectId(patientId);

    
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
        const patientRecord = {
          patientObjectId: new mongoose.Types.ObjectId(patientObjectId),
          selections: [{
            questionId: new mongoose.Types.ObjectId(questionId),
            selectedOptions
          }]
        };
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
  getSelections,
  saveSelections,
  removeSelections,
}
