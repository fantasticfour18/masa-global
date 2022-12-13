import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCardPageRoutingModule } from './my-card-routing.module';

import { MyCardPage } from './my-card.page';
import { MembershipCardComponent } from '../home/components/membership-card/membership-card.component';
import { HomePageModule } from '../home/home.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCardPageRoutingModule,
    HomePageModule
  ],
  declarations: [MyCardPage]
})
export class MyCardPageModule {}
