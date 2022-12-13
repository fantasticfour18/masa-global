import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';

import { MembershipCardComponent } from './components/membership-card/membership-card.component';
import { MemberInformationCardComponent } from './components/member-information-card/member-information-card.component';
import { SpouseCardComponent } from './components/spouse-card/spouse-card.component';
import { DependentsCardComponent } from './components/dependents-card/dependents-card.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HomePage }]),
  ],
  declarations: [
    HomePage,
    MembershipCardComponent,
    MemberInformationCardComponent,
    SpouseCardComponent,
    DependentsCardComponent,
  ],
  exports: [MembershipCardComponent]
})
export class HomePageModule {}
