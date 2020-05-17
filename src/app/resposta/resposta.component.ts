import { ApiService } from './../api-service.service';
import { NavController, LoadingController, Platform } from '@ionic/angular';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../app-quiz.service';
import { QuestionarioRespondido } from '../models/questionarioRespondido.model';
import { QuestionarioRespostaView } from '../models/questionarioRespostaView';
import { Formulario } from '../models/formulario.model';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-resposta',
  templateUrl: './resposta.component.html',
  styleUrls: ['./resposta.component.scss'],
})
export class RespostaComponent implements OnInit {
  private quizId = null;
  questionarioRespostaView: QuestionarioRespostaView;
  formularioView: Formulario;
  totalScore: number = 0;
  loading: any;
  dataHoje: Date = new Date();

  @ViewChild('divImpressao', { static: false }) divView: ElementRef;

  ngOnInit(): void {
    this.quizId = this.route.snapshot.params.optional_id;
    if (this.quizId != null) {
      this.recuperarDadosFormulario(this.api.KEY_FORMULARIO_PREENCHIDO);
      this.recuperarQuestionario(this.api.KEY_QUESTIONARIOS_RESPONDIDOS + this.quizId);
    }
  }

  constructor(private navCtrl: NavController, private plt: Platform, private api: ApiService, private quizApi: QuizService,
    private route: ActivatedRoute, private router: Router, private loadingController: LoadingController,
    private file: File, private fileOpener: FileOpener) { }

  goBack() {
    this.quizId = null;
    this.router.navigate(['']);
  }

  async presentLoadingWithOptions(msg: string) {
    this.loading = await this.loadingController.create({
      spinner: null,
      message: msg,
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await this.loading.present();
  }

  //Implementar metodo para gerar pdf...
  exportPdf() {
    if (this.plt.is('cordova')) {
      this.presentLoadingWithOptions('Preparando PDF...');
      //const divToPdf = this.divView.nativeElement.innerHTML;
      const divToPdf = document.getElementById('div-impressao');
      const options = { background: "white", width: divToPdf.clientWidth, heigth: divToPdf.clientHeight, quality: 1.0 };
      console.log(divToPdf.clientWidth);
      console.log(divToPdf.clientHeight);

      domtoimage.toJpeg(divToPdf, options).then((dataUrl) => {
        var doc = new jsPDF("p", "mm", "a4");

        //Add Url da imagem no PDF
        doc.addImage(dataUrl, 'Jpeg', 5, 5, 215, 285);

        let pdfOutput = doc.output();

        //Para colocar a imagem dentro do PDF
        let buffer = new ArrayBuffer(pdfOutput.length);
        let array = new Uint8Array(buffer);
        for (let i = 0; i < pdfOutput.length; i++) {
          array[i] = pdfOutput.charCodeAt(i);
        }

        //Para armazenar o PDF
        const directory = this.file.dataDirectory;
        const fileName = "questionario.pdf";
        let options: IWriteOptions = { replace: true };

        this.file.checkDir(directory, 'PDF').then(() => {
          this.file.writeFile(directory + 'PDF/', fileName, buffer, options).then((data) => {
            this.fileOpener.open(directory + 'PDF/' + fileName, 'application/pdf').then(_ => {
              this.loading.dismiss();
            });
          });
        })
          .catch(error => {
            this.file.createDir(directory, 'PDF', false).then(result => {
              this.file.writeFile(directory + 'PDF/', fileName, buffer, options).then((data) => {
                this.fileOpener.open(directory + 'PDF/' + fileName, 'application/pdf').then(_ => {
                  this.loading.dismiss();
                });
              });
            });
          });
      });
    }
  }

  private recuperarQuestionario(key: string) {
    this.questionarioRespostaView = new QuestionarioRespostaView();

    this.api.recuperar(key).then((questionario) => {
      let questionarioRespData: QuestionarioRespondido = JSON.parse(questionario);
      let respostaIds: Array<any> = new Array<any>();
      let opcaoIds: Array<any> = new Array<any>();

      questionarioRespData.questoes.forEach(f => {
        respostaIds.push(f.resposta.id);
        opcaoIds.push(f.resposta.opcao.id);
      });

      this.quizApi.GetQuizzes().then((questionarioList: any) => {
        questionarioList = questionarioList.questionario.filter(q => q.id == this.quizId);

        questionarioRespData.questoes.forEach(qdt => {
          let idResposta = qdt.resposta.id;
          let idOpcao = qdt.resposta.opcao.id;

          questionarioList.forEach(quest => {
            quest.questoes.forEach(questao => {
              if (questao.id == qdt.id) {
                this.questionarioRespostaView.questaoId = questao.id;
                this.questionarioRespostaView.descricao = questao.descricao;

                questao.respostas.forEach(resp => {
                  if (resp.id == idResposta) {
                    var resposta = {
                      id: resp.id,
                      descricao: resp.descricao,
                      opcao: {}
                    };

                    resp.opcoes.forEach(opcao => {
                      if (opcao.id == idOpcao) {
                        let opcaoObj = {
                          id: opcao.id,
                          descricao: opcao.descricao,
                          score: opcao.score
                        };

                        resposta.opcao = opcaoObj;
                        this.questionarioRespostaView.respostas.push(resposta);
                        this.totalScore = opcao.score + this.totalScore;
                      }
                    });
                  }
                });
              }
            });
          });
        });
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  private recuperarDadosFormulario(key: string) {
    this.formularioView = new Formulario();

    this.api.recuperar(key).then((formulario) => {
      this.formularioView = JSON.parse(formulario);
    });
  }
}
