import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { OptionModel } from 'src/app/models/option.model';
import { QuizService } from 'src/app/app-quiz.service';
import { QuizModel } from 'src/app/models/quiz.model';

@Component({
  selector: 'app-modal-option',
  templateUrl: './modal-option.page.html',
  styleUrls: ['./modal-option.page.scss'],
})
export class ModalOptionPage implements OnInit {

  @Input() answerId: number;
  @Input() quizId: number;

  options: Array<OptionModel>;
  quizList: Array<QuizModel>;
  optionSelectedId: number;

  constructor(private navParams: NavParams, public modalController: ModalController, private apiQuiz: QuizService) {
    this.quizList = new Array<QuizModel>();
    this.options = new Array<OptionModel>();
  }

  ngOnInit() {
    this.listaQuiestionarios(this.navParams.get('quizId'), this.navParams.get('answerId'));
  }

  listaQuiestionarios(quizId: number, answerId: number) {
    this.apiQuiz.GetQuizzes().then((res: any) => {
      this.quizList = res.questionario;
      this.quizList = this.quizList.filter(f => f.id == quizId && f.questoes.some(fq => fq.respostas
        .some(r => r.id == answerId)));

      this.quizList.forEach(f => {
        f.questoes.forEach(q => {
          q.respostas.forEach(r => {
            this.options = r.opcoes;
          });
        });
      });
    });
  }

  dismissModal() {
    this.modalController.dismiss({
      'optionId': this.optionSelectedId
    });
  }

  radioSelect(event) {
    this.optionSelectedId = event.detail.value;
  }
}
