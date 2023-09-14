import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewComunicadoPageRoutingModule } from './new-comunicado-routing.module';

import { NewComunicadoPage } from './new-comunicado.page';
import { ComponentsModule } from '../components/components.module';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewComunicadoPageRoutingModule,
    ComponentsModule,
    CKEditorModule
  ],
  declarations: [NewComunicadoPage]
})
export class NewComunicadoPageModule {
}
