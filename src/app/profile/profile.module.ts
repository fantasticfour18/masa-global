import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { ContactUsPage } from './contact-us/contact-us.page';
import { UserSettingsPage } from './user-settings/user-settings.page';
import { NotificationsPage } from './notifications/notifications.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { BankDetailsPage } from './bank-details/bank-details.page';
import { BankCardPage } from './bank-card/bank-card.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [
        { path: '', component: ProfilePage },
        { path: 'contact-us', component: ContactUsPage },
        { path: 'user-settings', component: UserSettingsPage },
        { path: 'notifications', component: NotificationsPage },
        { path: 'change-password', component: ChangePasswordPage },
        { path: 'bank-card', component: BankCardPage },
        { path: 'bank-details', component: BankDetailsPage },
      ],
    ),
  ],
  declarations: [ProfilePage, ContactUsPage, UserSettingsPage, NotificationsPage, ChangePasswordPage, 
    BankCardPage, BankDetailsPage]
})
export class ProfilePageModule {}
