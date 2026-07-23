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
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/pages/list/employee-list.component').then(m => m.EmployeeListComponent)
      },
      {
        path: 'employees/create',
        loadComponent: () => import('./features/employees/pages/create/employee-create.component').then(m => m.EmployeeCreateComponent)
      },
      {
        path: 'employees/edit/:id',
        loadComponent: () => import('./features/employees/pages/edit/employee-edit.component').then(m => m.EmployeeEditComponent)
      },
      {
        path: 'vendors',
        loadComponent: () => import('./features/vendors/pages/list/vendor-list.component').then(m => m.VendorListComponent)
      },
      {
        path: 'vendors/create',
        loadComponent: () => import('./features/vendors/pages/create/vendor-create.component').then(m => m.VendorCreateComponent)
      },
      {
        path: 'vendors/edit/:id',
        loadComponent: () => import('./features/vendors/pages/edit/vendor-edit.component').then(m => m.VendorEditComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/pages/list/category-list.component').then(m => m.CategoryListComponent)
      },
      {
        path: 'categories/create',
        loadComponent: () => import('./features/categories/pages/create/category-create.component').then(m => m.CategoryCreateComponent)
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () => import('./features/categories/pages/edit/category-edit.component').then(m => m.CategoryEditComponent)
      },
      {
        path: 'locations',
        loadComponent: () => import('./features/locations/pages/list/location-list.component').then(m => m.LocationListComponent)
      },
      {
        path: 'locations/create',
        loadComponent: () => import('./features/locations/pages/create/location-create.component').then(m => m.LocationCreateComponent)
      },
      {
        path: 'locations/edit/:id',
        loadComponent: () => import('./features/locations/pages/edit/location-edit.component').then(m => m.LocationEditComponent)
      },
      {
        path: 'assets',
        loadComponent: () => import('./features/assets/pages/list/asset-list.component').then(m => m.AssetListComponent)
      },
      {
        path: 'assets/create',
        loadComponent: () => import('./features/assets/pages/create/asset-create.component').then(m => m.AssetCreateComponent)
      },
      {
        path: 'assets/edit/:id',
        loadComponent: () => import('./features/assets/pages/edit/asset-edit.component').then(m => m.AssetEditComponent)
      },
      {
        path: 'allocations',
        loadComponent: () => import('./features/allocations/pages/list/allocation-list.component').then(m => m.AllocationListComponent)
      },
      {
        path: 'allocations/create',
        loadComponent: () => import('./features/allocations/pages/create/allocation-create.component').then(m => m.AllocationCreateComponent)
      },
      {
        path: 'transfers',
        loadComponent: () => import('./features/transfers/pages/list/transfer-list.component').then(m => m.TransferListComponent)
      },
      {
        path: 'transfers/create',
        loadComponent: () => import('./features/transfers/pages/create/transfer-create.component').then(m => m.TransferCreateComponent)
      },
      {
        path: 'returns',
        loadComponent: () => import('./features/returns/pages/list/return-list.component').then(m => m.ReturnListComponent)
      },
      {
        path: 'returns/create',
        loadComponent: () => import('./features/returns/pages/create/return-create.component').then(m => m.ReturnCreateComponent)
      },
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
