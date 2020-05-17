import {AnswerModel} from './answer.model';

/**
 * Option data model
 * 
 * @export
 * @interface OptionModel
 */
export interface OptionModel{

    /**
     * Option id
     * 
     * @type {number}
     * @memberof OptionModel
     */
    id: number;

    /**
     * Option name
     * 
     * @type {string}
     * @memberof OptionModel
     */
    descricao: string;

    /**
     * Option name
     * 
     * @type {boolean}
     * @memberof OptionModel
     */
    selecionada: boolean;

    /**
     * Option Score
     * 
     * @type {number}
     * @memberof OptionModel
     */
    score: number;

    /**
     * Option answer
     * 
     * @type {AnswerModel}
     * @memberof OptionModel
     */
    resposta: AnswerModel;
}