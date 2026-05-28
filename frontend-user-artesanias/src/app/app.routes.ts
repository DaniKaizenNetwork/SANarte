import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'catalogo'
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./features/catalog/catalog-page/catalog-page.component').then(
        m => m.CatalogPageComponent
      )
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./features/categories/categories-page/categories-page.component').then(
        m => m.CategoriesPageComponent
      )
  },
  {
    path: 'productos/:id',
    loadComponent: () =>
      import(
        './features/product-detail/product-detail-page/product-detail-page.component'
      ).then(m => m.ProductDetailPageComponent)
  },
  {
    path: '**',
    redirectTo: 'catalogo'
  }
];
