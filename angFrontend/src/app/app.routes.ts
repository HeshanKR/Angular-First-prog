//file: app.routes.ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
  { path: 'admin/roles', component: RoleEditor, canActivate: [adminGuard] },
  // other routes...
];
