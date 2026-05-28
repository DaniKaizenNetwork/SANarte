import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, SlidersHorizontal, X } from 'lucide-angular';

import { Category } from '../../../core/models/category.model';
import { Product } from '../../../core/models/product.model';
import { PublicCategoryService } from '../../../core/services/public-category.service';
import { PublicProductService } from '../../../core/services/public-product.service';

type SortOrder = 'asc' | 'desc' | null;

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, LucideAngularModule],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss'
})
export class CatalogPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(PublicProductService);
  private readonly categoryService = inject(PublicCategoryService);

  readonly filterIcon = SlidersHorizontal;
  readonly closeIcon = X;

  readonly categories = signal<Category[]>([]);
  readonly allProducts = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly selectedCategoryId = signal<number | null>(null);
  readonly sortOrder = signal<SortOrder>(null);
  readonly displayLimit = signal(8);
  readonly showFilterPanel = signal(false);

  readonly selectedCategory = computed(() => {
    const id = this.selectedCategoryId();
    if (id === null) return null;
    return this.categories().find(c => c.idCategoria === id) ?? null;
  });

  readonly sortedProducts = computed(() => {
    const products = [...this.allProducts()];
    const order = this.sortOrder();
    if (order === 'asc') return products.sort((a, b) => a.precio - b.precio);
    if (order === 'desc') return products.sort((a, b) => b.precio - a.precio);
    return products;
  });

  readonly visibleProducts = computed(() =>
    this.sortedProducts().slice(0, this.displayLimit())
  );

  readonly hasMore = computed(
    () => this.visibleProducts().length < this.sortedProducts().length
  );

  readonly activeFiltersCount = computed(() => {
    let count = 0;
    if (this.selectedCategoryId() !== null) count++;
    if (this.sortOrder() !== null) count++;
    return count;
  });

  ngOnInit(): void {
    this.loadCategories();

    const catParam = this.route.snapshot.queryParamMap.get('categoria');
    const catId = catParam ? Number(catParam) : null;

    if (catId && Number.isFinite(catId)) {
      this.selectedCategoryId.set(catId);
      this.loading.set(true);
      this.productService.getByCategory(catId).subscribe({
        next: products => {
          this.allProducts.set(products);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los productos de esta categoría.');
          this.loading.set(false);
        }
      });
    } else {
      this.loadProducts();
    }
  }

  selectCategory(categoryId: number): void {
    if (this.selectedCategoryId() === categoryId) {
      this.clearCategory();
      return;
    }
    this.selectedCategoryId.set(categoryId);
    this.displayLimit.set(8);
    this.loading.set(true);
    this.error.set('');

    this.productService.getByCategory(categoryId).subscribe({
      next: products => {
        this.allProducts.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos de esta categoría.');
        this.loading.set(false);
      }
    });
  }

  clearCategory(): void {
    this.selectedCategoryId.set(null);
    this.displayLimit.set(8);
    this.loadProducts();
  }

  setSortOrder(order: SortOrder): void {
    this.sortOrder.set(order);
    this.showFilterPanel.set(false);
  }

  clearSort(): void {
    this.sortOrder.set(null);
  }

  loadMore(): void {
    this.displayLimit.update(n => n + 8);
  }

  toggleFilterPanel(): void {
    this.showFilterPanel.update(v => !v);
  }

  getProductImage(product: Product): string {
    return product.imagenUrl || FALLBACK_IMAGE;
  }

  getSortLabel(order: SortOrder): string {
    if (order === 'asc') return 'Precio: Menor a Mayor';
    if (order === 'desc') return 'Precio: Mayor a Menor';
    return '';
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    this.productService.getAll().subscribe({
      next: products => {
        this.allProducts.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos.');
        this.loading.set(false);
      }
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: cats => this.categories.set(cats),
      error: () => {}
    });
  }
}
