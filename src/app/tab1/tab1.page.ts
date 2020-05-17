import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Formulario as FormularioModel } from '../models/formulario.model';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { QuizService } from '../app-quiz.service';

enum tipoMensagem {
  sucesso,
  alerta,
  informacao
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  formulario: FormGroup;
  parentescoArray: Array<string>;
  exibeNovoForm: boolean = false;
  formularioPaciente: FormularioModel;

  ngOnInit(): void {
    this.criarValidacoes();

    this.parentescoArray = [
      "Mãe",
      "Pai",
      "Avó",
      "Avô",
      "Irmã",
      "Irmão",
      "Outro"
    ];

    this.api.recuperar(this.api.KEY_FORMULARIO_PREENCHIDO).then((form) => {
      this.exibeNovoForm = form ? true : false;
    });
  }

  constructor(private api: ApiService, public formBuilder: FormBuilder,
    private alertController: AlertController, private router: Router, private quizApi: QuizService) { }

  validacoes_erros = {
    'nomeResponsavel': [
      { type: 'required', message: 'Nome do responsável é obrigatório.' }
    ],
    'nomeCrianca': [
      { type: 'required', message: 'Nome da criança é obrigatório.' }
    ],
    'dataNascimento': [
      { type: 'required', message: 'Data de nascimento é obrigatório.' }
    ]
  }

  onSubmit(values) {
    let formParaSalvar: FormularioModel = values;
    let podeSalvar: boolean = true;

    let dataHoje = new Date();
    let dataNascimento = new Date(formParaSalvar.dataNascimento);
    let diferencaEmHoras = dataHoje.getTime() - dataNascimento.getTime();
    let diferencaEmDias = diferencaEmHoras / (1000 * 3600 * 24);

    if (parseInt(diferencaEmDias.toFixed(0)) >= 1095 && parseInt(diferencaEmDias.toFixed(0)) <= 1460) //3 anos até 1 dia antes de 4 anos
      formParaSalvar.idade = 3;
    else if (parseInt(diferencaEmDias.toFixed(0)) >= 1460 && parseInt(diferencaEmDias.toFixed(0)) <= 1825) //4 anos até 1 dia antes de 5 anos
      formParaSalvar.idade = 4;
    else //Fora da faixa de 3 e 4 anos de idade
      podeSalvar = false;

    //To do: limpar form depois de salvar
    this.salvarFormulario(podeSalvar, formParaSalvar);
  }

  novoQuestionario() {
    this.mensagem(tipoMensagem.informacao);
  }

  private criarValidacoes() {
    this.formulario = this.formBuilder.group({
      nomeResponsavel: new FormControl('', Validators.required),
      nomeCrianca: new FormControl('', Validators.required),
      dataNascimento: new FormControl('', Validators.required),
      parentesco: new FormControl('', Validators.required),
      prematuro: new FormControl('', Validators.required)
    });
  }

  private async mensagem(tipo: tipoMensagem, textoMensage?: string) {
    if (tipo == tipoMensagem.sucesso) {
      const sucessoMsg = await this.alertController.create({
        header: 'Sucesso!',
        message: 'Formulário salvo com sucesso, agora você pode responder ao questionário ;)',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            cssClass: 'primary',
            handler: () => {
              this.exibeNovoForm = true;
              this.router.navigate(['']);
            }
          }
        ]
      });

      await sucessoMsg.present();
    }
    else if (tipo == tipoMensagem.informacao) {
      const informacaoMsg = await this.alertController.create({
        header: 'Atenção!',
        message: 'Os questionários respondidos serão apagados, caso não tenha compartilhado o questionário, realize via e-mail, se já compartilhou, clique em "Ok"',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            cssClass: 'primary',
            handler: () => {
              this.exibeNovoForm = false;
              this.limparLocalStorage();
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'danger',
            handler: () => {
              this.exibeNovoForm = true;
            }
          }
        ]
      });

      await informacaoMsg.present();
    }
    else {
      const alertaMsg = await this.alertController.create({
        header: 'Atenção!',
        message: textoMensage,
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            cssClass: 'primary',
            handler: () => {
            }
          }
        ]
      });

      await alertaMsg.present();
    }
  }

  private async salvarFormulario(podeSalvar: boolean, formulario: FormularioModel){
    if (podeSalvar) {
      await this.api.save(this.api.KEY_FORMULARIO_PREENCHIDO, JSON.stringify(formulario)).then(() => {
        this.mensagem(tipoMensagem.sucesso);
      });
    }
    else {
      await this.mensagem(tipoMensagem.alerta, "A idade da criança está fora da faixa de 3 ou 4 anos de idade!");
    }
  }

  private limparLocalStorage(){
    this.api.recuperar(this.api.KEY_FORMULARIO_PREENCHIDO).then((form) => {
      if (form) {
        this.formularioPaciente = JSON.parse(form); 

        this.quizApi.GetQuizzes().then((res: any) => {
          let quizId = res.questionario.filter(f => f.idade == this.formularioPaciente.idade)[0].id;

          this.api.deleteItemLocalStorage(this.api.KEY_FORMULARIO_PREENCHIDO);
          this.api.deleteItemLocalStorage(this.api.KEY_QUESTIONARIOS_RESPONDIDOS + quizId);
        });
      }
    });
  }
}
