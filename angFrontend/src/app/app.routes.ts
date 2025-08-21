//file: app.routes.ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OauthSuccess } from './pages/oauth-success/oauth-success';

import { RoleEditor } from './pages/admin/role-editor/role-editor';
import { adminGuard } from './auth/admin-guard';
import { userGuard } from './auth/user-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [userGuard],
  },
  { path: 'oauth-success', component: OauthSuccess },
  { path: 'admin/roles', component: RoleEditor, canActivate: [adminGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
  // other routes...
];
