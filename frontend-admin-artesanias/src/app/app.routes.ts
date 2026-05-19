import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page/login-page.component')
        .then(m => m.LoginPageComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-shell/admin-shell.component')
        .then(m => m.AdminShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'productos'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/products/product-list/product-list.component')
            .then(m => m.ProductListComponent)
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/products/product-list/product-list.component')
            .then(m => m.ProductListComponent)
      },
      {
        path: 'productos/nuevo',
        loadComponent: () =>
          import('./features/products/product-form/product-form.component')
            .then(m => m.ProductFormComponent)
      },
      {
        path: 'productos/:id/editar',
        loadComponent: () =>
          import('./features/products/product-form/product-form.component')
            .then(m => m.ProductFormComponent)
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/categories/category-list/category-list.component')
            .then(m => m.CategoryListComponent)
      },
      {
        path: 'categorias/nueva',
        loadComponent: () =>
          import('./features/categories/category-form/category-form.component')
            .then(m => m.CategoryFormComponent)
      },
      {
        path: 'categorias/:id/editar',
        loadComponent: () =>
          import('./features/categories/category-form/category-form.component')
            .then(m => m.CategoryFormComponent)
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./features/products/product-list/product-list.component')
            .then(m => m.ProductListComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'productos'
  }
];
