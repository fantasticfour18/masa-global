import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        children: [
          {
            path: '',
            loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
          },
        ],
      },
      {
        path: 'register',
        children: [
          {
            path: '',
            loadChildren: () => import('./register/register.module').then((m) => m.RegisterPageModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: '/auth/login' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
