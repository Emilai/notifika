import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupeditPageRoutingModule } from './groupedit-routing.module';

import { GroupeditPage } from './groupedit.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupeditPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GroupeditPage]
})
export class GroupeditPageModule {}
