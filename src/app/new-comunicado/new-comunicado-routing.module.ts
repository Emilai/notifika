import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewComunicadoPage } from './new-comunicado.page';

const routes: Routes = [
  {
    path: '',
    component: NewComunicadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewComunicadoPageRoutingModule {}
