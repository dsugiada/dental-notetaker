'use strict'

import Question from '../question.model'
import { ClientError } from '../../../../core/server/server.interface'

/**
 * Get all question data by id
 * @param id string
 * @returns object
 */
const check = async (id: string): Promise<any> => {
  const result = await Question.findOne({ _id: id })
  if (!result) {
    throw new ClientError(1002, 'question not found')
  }
  return result
}

/**
 * Remove question by id
 * @param id string
 * @returns object
 */
const remove = async (id: string): Promise<any> => {
    const result = await Question.findOneAndRemove({ _id: id })
    if (!result) {
      throw new ClientError(1002, 'question not found')
    }
    return true
  }
  
  export default { check, remove }
  export { check, remove }