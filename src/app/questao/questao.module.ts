
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestaoComponent } from './questao.component';
import { ModalOptionPage } from '../modal/modal-option/modal-option.page';

const routes: Routes = [
    {
        path: '',
        component: QuestaoComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,        
        RouterModule.forChild(routes)
    ],
    entryComponents:[
        ModalOptionPage
    ],
    declarations: [QuestaoComponent]
})
export class QuestaoComponentModule { }
