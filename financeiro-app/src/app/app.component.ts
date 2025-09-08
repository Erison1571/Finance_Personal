import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Controle Financeiro Pessoal';
  
  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/categorias', label: 'Categorias', icon: 'category' },
    { path: '/tipos', label: 'Tipos', icon: 'type_specimen' },
    { path: '/despesas', label: 'Despesas', icon: 'trending_down' },
    { path: '/receitas', label: 'Receitas', icon: 'trending_up' }
  ];
}
