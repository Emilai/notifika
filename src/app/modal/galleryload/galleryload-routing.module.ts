import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GalleryloadPage } from './galleryload.page';

const routes: Routes = [
  {
    path: '',
    component: GalleryloadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GalleryloadPageRoutingModule {}
