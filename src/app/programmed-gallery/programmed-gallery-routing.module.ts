import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgrammedGalleryPage } from './programmed-gallery.page';

const routes: Routes = [
  {
    path: '',
    component: ProgrammedGalleryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgrammedGalleryPageRoutingModule {}
