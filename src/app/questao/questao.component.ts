import { ApiService } from './../api-service.service';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../app-quiz.service';
import { QuizModel } from '../models/quiz.model';
import { QuestionModel } from '../models/question.model';
import { QuestionarioRespondido } from '../models/questionarioRespondido.model';
import { ModalOptionPage } from '../modal/modal-option/modal-option.page';

enum tipoMensagem {
  sucesso,
  alerta
}

@Component({
  selector: 'app-questao',
  templateUrl: './questao.component.html',
  styleUrls: ['./questao.component.scss'],
})
export class QuestaoComponent implements OnInit {
  argumentos = null;
  quizList: Array<QuizModel>;
  questions: Array<QuestionModel>;
  disableAnswerList: number[];
  questionnaireAnswered: QuestionarioRespondido = new QuestionarioRespondido();
  quizId: number;

  ngOnInit(): void {
    this.argumentos = this.route.snapshot.params.optional_id;
    if (this.argumentos != null) {
      this.quizId = this.argumentos;
      this.questionnaireAnswered.id = this.argumentos;
      this.listaQuiestionarios(this.argumentos);
    }
  }

  constructor(private navCtrl: NavController, private api: ApiService, private apiQuiz: QuizService,
    private route: ActivatedRoute, private router: Router, public modalController: ModalController,
    private alertController: AlertController) {
    this.disableAnswerList = [];
  }

  goBack() {
    this.verificaSeRespondendoForm();
  }

  async showModal(questionId: number, answerId: number) {
    const modal = await this.modalController.create({
      component: ModalOptionPage,
      componentProps: {
        'answerId': answerId,
        'quizId': this.quizId
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.montaQuestionarioRespondido(questionId, answerId, data.optionId);
  }

  listaQuiestionarios(id: number) {
    this.quizList = new Array<QuizModel>();
    this.questions = new Array<QuestionModel>();

    this.apiQuiz.GetQuizzes().then((res: any) => {
      this.quizList = res.questionario;
      this.quizList = this.quizList.filter(f => f.id == id);

      this.quizList.forEach(f => {
        this.questions = f.questoes;
      });
    });
  }

  desabilitaOpcao(answerId: number): boolean {
    let retorno: boolean = false;

    if (this.disableAnswerList.some(s => s.valueOf() == answerId))
      retorno = true;

    return retorno;
  }

  habilitaBotao(): boolean {
    let qtdTotalQuestoes: number;
    let qtdQuestaoRespondida: number = this.questionnaireAnswered.questoes.length;

    this.quizList.forEach(q => {
      q.questoes.forEach(qt => {
        qtdTotalQuestoes = qt.respostas.length;
      });
    });

    return qtdTotalQuestoes == qtdQuestaoRespondida ? true : false;
  }

  salvarRespostas() {
    this.salvandoRespostas(this.api.KEY_QUESTIONARIOS_RESPONDIDOS + this.quizId.toString(), JSON.stringify(this.questionnaireAnswered));
  }

  private async mensagem(tipo: tipoMensagem, id?: string) {
    if (tipo == tipoMensagem.sucesso) {
      const sucessoMsg = await this.alertController.create({
        header: 'Sucesso!',
        message: 'Questionário salvo com sucesso!!!',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            cssClass: 'primary',
            handler: () => {
              this.router.navigate(['/resposta', id]);
            }
          }
        ]
      });

      await sucessoMsg.present();
    }
    else {
      const alertaMsg = await this.alertController.create({
        header: 'Atenção!',
        message: 'Você ainda não terminou o questionário!  Deseja realmente sair e perder as informações?',
        buttons: [
          {
            text: 'Não',
            role: 'nao',
            cssClass: 'primary',
            handler: () => {
            }
          },
          {
            text: 'Sim',
            role: 'sim',
            cssClass: 'danger',
            handler: () => {
              this.argumentos = null;
              this.navCtrl.back();
            }
          }
        ]
      });

      await alertaMsg.present();
    }
  }

  private salvandoRespostas(key: string, questionario: string) {
    this.api.save(key, questionario).then((res) => {
      this.mensagem(tipoMensagem.sucesso, this.quizId.toString());
    }).catch((err) => {
      console.log('');
    });
  }

  private montaQuestionarioRespondido(questionId: number, answerId: number, optionId: number) {
    let questaoResp = {
      id: questionId,
      resposta: {
        id: answerId,
        opcao: {
          id: optionId
        }
      }
    };

    this.questionnaireAnswered.questoes.push(questaoResp);
    this.disableAnswerList.push(answerId);
  }

  private verificaSeRespondendoForm() {
    if (this.questionnaireAnswered.questoes.length > 0) {
      this.mensagem(tipoMensagem.alerta);
    }
    else {
      this.argumentos = null;
      this.navCtrl.back();
    }
  }
}
