'use strict'

import express from 'express'
import { settings, show } from '../../../../core/config'
import { ClientError } from '../../../../core/server/server.interface'
import { response } from '../../../../core/server'
import PatientModel from '../patients/patient.model'

/**
 * Get all question data
 * @param req object
 * @param res object
 * @param next object
 * @returns object
 */
const get = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<express.Response<any, Record<string, any>>> => {
  try {
    show.debug('[PATIENT][GET] Request')
    const result = await PatientModel.find({})
    if (!result.length) {
      throw new ClientError(1002, 'No questions found');
    } else {
      show.debug('[PATIENT][GET] Success');
      return response.send(res, 200, result, false);
    }
  } catch (err: any) {
    show.debug(`[PATIENT][GET] Error ${err.type} ${err.code} ${err.message}`);
    if (err.type === 'client') {
      return response.send(res, 400, false, err);
    } else {
      return response.send(res, 500, false, err);
    }
  }
};

const getPatients = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response<any, Record<string, any>>> => {
  try {
    const clinicianId = req.params.userId;
    const patients = await PatientModel.find({ assignedClinicians: clinicianId });
    return response.send(res, 200, patients, false);
  } catch (error: any) {
    const message: string = (error instanceof Error) ? error.message : 'An unknown error occurred';
    return res.status(500).json({ message: 'Error fetching patients', error: message });
  }
};

/**
 * add question
 * @param req object
 * @param res object
 * @param next object
 * @returns object
 */
const add = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<express.Response<any, Record<string, any>> | undefined> => {
  try {
    show.debug('[PATIENT][ADD] Request');
    const { text, options } = req.body;

    if (!text || !options) {
      throw new ClientError(1001, 'parameters not found');
    }

    // Create a new Question document using the Mongoose model
    const question = new PatientModel({
      text: text,
      options: options,
      created: new Date() // This will automatically be converted to an ISO string by Mongoose
    });

    // Save the new Question document to the database
    const result = await question.save();

    show.debug('[PATIENT][ADD] Success');
    return response.send(res, 200, result, false);
  } catch (err: any) {
    show.debug(`[PATIENT][ADD] Error ${err.type} ${err.code} ${err.message}`);
    if (
      err.type === 'client' ||
      (err.name === 'MongoServerError' && err.code === 11000) // Duplicated record
    ) {
      return response.send(res, 400, false, err);
    } else {
      return response.send(res, 500, false, err);
    }
  }
};

/**
 * Remove user account
 * @param req object
 * @param res object
 * @param next object
 * @returns object
 */
const remove = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<express.Response<any, Record<string, any>>> => {
  try {
    show.debug('[PATIENT][REMOVE] Request')
    const { id } = req.body
    if (!id) {
      throw new ClientError(1001, 'parameters not found')
    }
    const result = await PatientModel.findOneAndRemove({ _id: id })
    show.debug('[PATIENT][REMOVE] Success')
    if (!result) {
      throw new ClientError(1002, 'account not found')
    } else {
      return response.send(res, 200, result, false)
    }
  } catch (err: any) {
    show.debug(
      `[PATIENT][REMOVE] Error ${err.type} ${err.code} ${err.message}`
    )
    if (err.type === 'client') {
      return response.send(res, 400, false, err)
    } else {
      return response.send(res, 500, false, err)
    }
  }
}

export default {
  get,
  add,
  remove,
  getPatients,
}