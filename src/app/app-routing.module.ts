import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'questao/:optional_id', loadChildren: './questao/questao.module#QuestaoComponentModule' },
  { path: 'resposta/:optional_id', loadChildren: './resposta/resposta.module#RespostaComponentModule' },
  { path: 'modal-option', loadChildren: './modal/modal-option/modal-option.module#ModalOptionPageModule' },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
