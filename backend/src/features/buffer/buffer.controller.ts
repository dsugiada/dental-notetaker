import Examination from './exam-buffer.model';
import { Selection, Examination as ExaminationInterface } from './buffer.interface';

/**
 * Register a new examination with selected answers
 * @param data Examination data including selections
 * @returns The saved examination document
 */
const createExamination = async (data: ExaminationInterface): Promise<ExaminationInterface> => {
  const examination = new Examination(data);
  await examination.save();
  return examination;
};
