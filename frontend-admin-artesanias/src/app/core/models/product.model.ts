import { Category } from './category.model';

export type ProductStatus = 'DISPONIBLE' | 'AGOTADO';

export interface Product {
  idProducto: number;
  nombre: string;
  detalle: string;
  precio: number;
  imagenUrl: string | null;
  estado: ProductStatus;
  categoria: Category;
}

export interface ProductRequest {
  nombre: string;
  detalle: string;
  precio: number;
  imagenUrl: string | null;
  estado: ProductStatus;
  idCategoria: number;
}
