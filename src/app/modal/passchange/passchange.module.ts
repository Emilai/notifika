import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasschangePageRoutingModule } from './passchange-routing.module';

import { PasschangePage } from './passchange.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasschangePageRoutingModule
  ],
  declarations: [PasschangePage]
})
export class PasschangePageModule {}
