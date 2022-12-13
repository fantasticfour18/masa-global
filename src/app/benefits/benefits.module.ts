import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BenefitsPage } from './benefits.page';
import { BenefitPage } from './benefit/benefit.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(
      [
        { path: '', component: BenefitsPage },
        { path: ':benefitId', component: BenefitPage },
      ],
    ),
  ],
  declarations: [BenefitsPage, BenefitPage],
})
export class BenefitsPageModule {}
