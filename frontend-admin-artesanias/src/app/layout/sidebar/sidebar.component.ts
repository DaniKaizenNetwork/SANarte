import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  readonly menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Products',
      route: '/productos',
      icon: 'products',
      exact: true
    },
    {
      label: 'Categories',
      route: '/categorias',
      icon: 'categories'
    },
    {
      label: 'Inventory',
      route: '/inventario',
      icon: 'inventory'
    }
  ];
}
