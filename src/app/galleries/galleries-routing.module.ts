import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GalleriesPage } from './galleries.page';

const routes: Routes = [
  {
    path: '',
    component: GalleriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GalleriesPageRoutingModule {}
