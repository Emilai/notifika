import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutoauthPage } from './autoauth.page';

const routes: Routes = [
  {
    path: '',
    component: AutoauthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoauthPageRoutingModule {}
