import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasschangePage } from './passchange.page';

const routes: Routes = [
  {
    path: '',
    component: PasschangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasschangePageRoutingModule {}
