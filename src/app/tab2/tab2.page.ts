import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from './../api-service.service';
import { QuizService } from '../app-quiz.service';
import { Formulario } from '../models/formulario.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {  
  public quizList: any;
  public existeQuestionarioRespondido: boolean;
  private formularioPaciente: Formulario;

  // ngOnInit(): void {
  //   this.carregarQuestionarios();
  // }

  ionViewWillEnter(){
    this.carregarQuestionarios();
  }

  ionViewWillLeave(){
    this.quizList = null;
    this.formularioPaciente = new Formulario();
  }

  constructor(private navCtrl: NavController, public router: Router, private api: ApiService, private quizApi: QuizService,
    private alertController: AlertController) { }

  goBack() {
    this.navCtrl.back();
  }

  carregarQuestionarios() {
    this.quizList = [];

    this.api.recuperar(this.api.KEY_FORMULARIO_PREENCHIDO).then((form) => {
      if (form) {
        this.formularioPaciente = JSON.parse(form); 
        this.quizApi.GetQuizzes().then((res: any) => {
          this.quizList = res.questionario.filter(f => f.idade == this.formularioPaciente.idade);
          this.verificaQuestionarioRespondido(this.quizList[0].id);
        });
      }
      else
        this.mensagemAlerta();
    });
  }

  abrirQuestionario(id: string) {
    this.router.navigate(['/questao', id]);
  }

  respostasQuestionario(id: string) {
    this.router.navigate(['/resposta', id]);
  }

  private async mensagemAlerta() {
    const sucessoMsg = await this.alertController.create({
      header: 'Alerta!',
      message: 'Necessário preencher os dados cadastrais para responder ao questionário!',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          cssClass: 'primary',
          handler: () => {
            this.router.navigate(['']);
          }
        }
      ]
    });

    await sucessoMsg.present();
  }

  private verificaQuestionarioRespondido(questionarioId: number){
    this.api.recuperar(this.api.KEY_QUESTIONARIOS_RESPONDIDOS + questionarioId).then((questionarioResp) =>{
      if(questionarioResp)
        this.existeQuestionarioRespondido = true;
      else
        this.existeQuestionarioRespondido = false;
    });
  }
}
