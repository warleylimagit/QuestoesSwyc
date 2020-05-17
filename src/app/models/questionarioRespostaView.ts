export class QuestionarioRespostaView{
    public questaoId: number;
    public descricao: string;
    public respostas: Array<any>;

    constructor(){
        this.respostas = new Array<any>();
    }
}