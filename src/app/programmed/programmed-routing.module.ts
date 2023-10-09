import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgrammedPage } from './programmed.page';

const routes: Routes = [
  {
    path: '',
    component: ProgrammedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgrammedPageRoutingModule {}
