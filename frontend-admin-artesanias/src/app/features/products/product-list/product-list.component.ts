import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  Edit3,
  LucideAngularModule,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2
} from 'lucide-angular';

import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    LucideAngularModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly searchTerm = signal('');
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly editIcon = Edit3;
  readonly filterIcon = SlidersHorizontal;
  readonly plusIcon = Plus;
  readonly searchIcon = Search;
  readonly trashIcon = Trash2;

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.products();
    }

    return this.products().filter(product =>
      product.nombre.toLowerCase().includes(term) ||
      product.detalle.toLowerCase().includes(term) ||
      product.categoria.nombre.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }

  deleteProduct(product: Product): void {
    const confirmed = confirm(
      `¿Deseas eliminar el producto "${product.nombre}"?`
    );

    if (!confirmed) {
      return;
    }

    this.productService.delete(product.idProducto).subscribe({
      next: () => {
        this.products.update(products =>
          products.filter(item => item.idProducto !== product.idProducto)
        );
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
      }
    });
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getAll().subscribe({
      next: products => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      }
    });
  }
}
