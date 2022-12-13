import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MsaDocumentsPageRoutingModule } from './msa-documents-routing.module';

import { MsaDocumentsPage } from './msa-documents.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MsaDocumentsPageRoutingModule
  ],
  declarations: [MsaDocumentsPage]
})
export class MsaDocumentsPageModule {}
