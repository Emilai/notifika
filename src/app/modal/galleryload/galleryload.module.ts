import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleryloadPageRoutingModule } from './galleryload-routing.module';

import { GalleryloadPage } from './galleryload.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GalleryloadPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GalleryloadPage]
})
export class GalleryloadPageModule {}
