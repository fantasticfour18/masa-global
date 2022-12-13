import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then((m) => m.HomePageModule),
          },
        ],
      },
      {
        path: 'payments',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('../payments/payments.module').then((m) => m.PaymentsPageModule),
          },
        ],
      },
      {
        path: 'benefits',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('../benefits/benefits.module').then((m) => m.BenefitsPageModule),
          },
        ],
      },
      {
        path: 'claims',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('../claims/claims.module').then((m) => m.ClaimsPageModule),
          },
        ],
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('../profile/profile.module').then((m) => m.ProfilePageModule),
          },
        ],
      },
      {
        path: 'msa-documents',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('../msa-documents/msa-documents.module').then((m) => m.MsaDocumentsPageModule),
          }
        ]
      },
      {
        path: 'my-card',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('../my-card/my-card.module').then((m) => m.MyCardPageModule),
          }
        ]
      },
      {
        path: '',
        canActivate: [AuthGuard],
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
