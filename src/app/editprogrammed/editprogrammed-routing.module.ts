import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditprogrammedPage } from './editprogrammed.page';

const routes: Routes = [
  {
    path: '',
    component: EditprogrammedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditprogrammedPageRoutingModule {}
