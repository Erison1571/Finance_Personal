import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'categorias', loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent) },
  { path: 'tipos', loadComponent: () => import('./features/tipos/tipos.component').then(m => m.TiposComponent) },
  { path: 'despesas', loadComponent: () => import('./features/despesas/despesas.component').then(m => m.DespesasComponent) },
  { path: 'receitas', loadComponent: () => import('./features/receitas/receitas.component').then(m => m.ReceitasComponent) }
];
