import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupeditPage } from './groupedit.page';

const routes: Routes = [
  {
    path: '',
    component: GroupeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupeditPageRoutingModule {}
