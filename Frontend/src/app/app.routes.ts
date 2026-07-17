import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'departments',
        loadComponent: () => import('./features/departments/pages/list/department-list.component').then(m => m.DepartmentListComponent)
      },
      {
        path: 'departments/create',
        loadComponent: () => import('./features/departments/pages/create/department-create.component').then(m => m.DepartmentCreateComponent)
      },
      {
        path: 'departments/edit/:id',
        loadComponent: () => import('./features/departments/pages/edit/department-edit.component').then(m => m.DepartmentEditComponent)
      },
      { path: 'employees', component: DashboardComponent },
      { path: 'vendors', component: DashboardComponent },
      { path: 'categories', component: DashboardComponent },
      { path: 'locations', component: DashboardComponent },
      { path: 'assets', component: DashboardComponent },
      { path: 'allocations', component: DashboardComponent },
      { path: 'transfers', component: DashboardComponent },
      { path: 'returns', component: DashboardComponent },
      { path: 'maintenance', component: DashboardComponent },
      { path: 'disposal', component: DashboardComponent },
      { path: 'reports', component: DashboardComponent },
      { path: 'notifications', component: DashboardComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
