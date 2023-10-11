import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgrammedEventsPageRoutingModule } from './programmed-events-routing.module';

import { ProgrammedEventsPage } from './programmed-events.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgrammedEventsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProgrammedEventsPage]
})
export class ProgrammedEventsPageModule {}
