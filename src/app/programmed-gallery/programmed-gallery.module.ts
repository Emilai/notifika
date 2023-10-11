import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgrammedGalleryPageRoutingModule } from './programmed-gallery-routing.module';

import { ProgrammedGalleryPage } from './programmed-gallery.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgrammedGalleryPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ProgrammedGalleryPage]
})
export class ProgrammedGalleryPageModule {}
