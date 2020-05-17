import {QuestionModel} from './question.model';

/**
 * Quiz data model
 * 
 * @export
 * @interface QuizModel
 */
export interface QuizModel{

    /**
     * Quiz id
     * 
     * @type {string}
     * @memberof QuizModel
     */
    id: number;

    /**
     * Quiz name
     * 
     * @type {number}
     * @memberof QuizModel
     */
    nome: string;

    /**
     * Quiz answered
     * 
     * @type {boolean}
     * @memberof QuizModel
     */
    respondido: boolean;

    /**
     * Quiz questions
     * 
     * @type {Array<QuestionModel>}
     * @memberof QuizModel
     */
    questoes: Array<QuestionModel>;
}