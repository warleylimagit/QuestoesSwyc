import {AnswerModel} from './answer.model';
import {QuizModel} from './quiz.model';

/**
 * Question data model
 * 
 * @export
 * @interface QuestionModel
 */
export interface QuestionModel{

    /**
     * Question id
     * 
     * @type {number}
     * @memberof QuestionModel
     */
    id: number;

    /**
     * Question title
     * 
     * @type {string}
     * @memberof QuestionModel
     */
    titulo: string;

    /**
     * Question description
     * 
     * @type {string}
     * @memberof QuestionModel
     */
    descricao: string;

    /**
     * Question answered
     * 
     * @type {boolean}
     * @memberof QuestionModel
     */
    respondido: boolean;

    /**
     * Question quiz
     * 
     * @type {QuizModel}
     * @memberof QuizModel
     */
    questionario: QuizModel;

    /**
     * Question answers
     * 
     * @type {Array<AnswerModel>}
     * @memberof QuestionModel
     */
    respostas: Array<AnswerModel>;
}