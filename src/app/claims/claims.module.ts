import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClaimsPage } from './claims.page';
import { ClaimPage } from './claim/claim.page';
import { NotePage } from './note/note.page';

import { ClaimCardComponent } from './claim/claim-card/claim-card.component';
import { ClaimNotesCardComponent } from './claim/claim-notes-card/claim-notes-card.component';
import { ClaimPaymentsCardComponent } from './claim/claim-payments-card/claim-payments-card.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: ClaimsPage,
        },
        {
          path: ':claimId',
          component: ClaimPage,
        },
        {
          path: ':claimId/notes/:noteId',
          component: NotePage,
        },
      ],
    ),
  ],
  declarations: [
    ClaimsPage,
    ClaimPage,
    NotePage,
    ClaimCardComponent,
    ClaimNotesCardComponent,
    ClaimPaymentsCardComponent,
  ],
})
export class ClaimsPageModule {}
