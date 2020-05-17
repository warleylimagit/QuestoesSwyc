import {OptionModel} from './option.model';
import {QuestionModel} from './question.model';

/**
 * Answer data model
 * 
 * @export
 * @interface AnswerModel
 */
export interface AnswerModel{

    /**
     * Answer id
     * 
     * @type {number}
     * @memberof AnswerModel
     */
    id: number;
    
    /**
     * Answer name
     * 
     * @type {string}
     * @memberof AnswerModel
     */
    descricao: string;

    /**
     * Answer selected
     * 
     * @type {boolean}
     * @memberof AnswerModel
     */
    respondida: boolean;

    /**
     * Answer quetion
     * 
     * @type {QuestionModel}
     * @memberof AnswerModel
     */
    pergunta: QuestionModel;

    /**
     * Answer options
     * 
     * @type {Array<OptionModel>}
     * @memberof AnswerModel
     */
    opcoes: Array<OptionModel>;
}