'use strict'

import express from 'express'
// import action from '../components/actions'
import { settings, show } from '../../../core/config'
import { ClientError } from '../../../core/server/server.interface'
import { response } from '../../../core/server'
import QuestionModel from '../../models/question/question.model'

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
    show.debug('[QUESTION][GET] Request')
    const result = await QuestionModel.find({})
    if (!result.length) {
      throw new ClientError(1002, 'No questions found');
    } else {
      show.debug('[QUESTION][GET] Success');
      return response.send(res, 200, result, false);
    }
  } catch (err: any) {
    show.debug(`[QUESTION][GET] Error ${err.type} ${err.code} ${err.message}`);
    if (err.type === 'client') {
      return response.send(res, 400, false, err);
    } else {
      return response.send(res, 500, false, err);
    }
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
    show.debug('[QUESTION][ADD] Request');
    const { text, options } = req.body;

    if (!text || !options) {
      throw new ClientError(1001, 'parameters not found');
    }

    // Create a new Question document using the Mongoose model
    const question = new QuestionModel({
      text: text,
      options: options,
      created: new Date() // This will automatically be converted to an ISO string by Mongoose
    });

    // Save the new Question document to the database
    const result = await question.save();

    show.debug('[QUESTION][ADD] Success');
    return response.send(res, 200, result, false);
  } catch (err: any) {
    show.debug(`[QUESTION][ADD] Error ${err.type} ${err.code} ${err.message}`);
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
    show.debug('[QUESTION][REMOVE] Request')
    const { id } = req.body
    if (!id) {
      throw new ClientError(1001, 'parameters not found')
    }
    const result = await QuestionModel.findOneAndRemove({ _id: id })
    show.debug('[QUESTION][REMOVE] Success')
    if (!result) {
      throw new ClientError(1002, 'account not found')
    }else{
    return response.send(res, 200, result, false)
    }
  } catch (err: any) {
    show.debug(
      `[QUESTION][REMOVE] Error ${err.type} ${err.code} ${err.message}`
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
}
