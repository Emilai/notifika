import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgrammedPageRoutingModule } from './programmed-routing.module';

import { ProgrammedPage } from './programmed.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
    declarations: [ProgrammedPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProgrammedPageRoutingModule,
      ComponentsModule
    ]
})
export class ProgrammedPageModule {}
