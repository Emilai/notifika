import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditprogrammedPageRoutingModule } from './editprogrammed-routing.module';

import { EditprogrammedPage } from './editprogrammed.page';
import { ComponentsModule } from '../components/components.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditprogrammedPageRoutingModule,
    ComponentsModule,
    CKEditorModule
  ],
  declarations: [EditprogrammedPage]
})
export class EditprogrammedPageModule {}
