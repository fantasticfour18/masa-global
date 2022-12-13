import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MsaDocumentsPage } from './msa-documents.page';

const routes: Routes = [
  {
    path: '',
    component: MsaDocumentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MsaDocumentsPageRoutingModule {}
