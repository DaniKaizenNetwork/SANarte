import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, MessageCircle } from 'lucide-angular';

import { Product } from '../../../core/models/product.model';
import { PublicProductService } from '../../../core/services/public-product.service';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&h=700&fit=crop';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, LucideAngularModule],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss'
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(PublicProductService);

  readonly arrowLeftIcon = ArrowLeft;
  readonly messageIcon = MessageCircle;

  readonly product = signal<Product | null>(null);
  readonly relatedProducts = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly productImage = computed(() => {
    const p = this.product();
    return p?.imagenUrl || FALLBACK_IMAGE;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || !Number.isFinite(id)) {
      this.error.set('Producto no encontrado.');
      return;
    }
    this.loadProduct(id);
  }

  getProductImage(product: Product): string {
    return product.imagenUrl || FALLBACK_IMAGE;
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.productService.getById(id).subscribe({
      next: product => {
        this.product.set(product);
        this.loading.set(false);
        this.loadRelated(product.categoria.idCategoria, id);
      },
      error: () => {
        this.error.set('No se encontró el producto solicitado.');
        this.loading.set(false);
      }
    });
  }

  private loadRelated(categoryId: number, excludeId: number): void {
    this.productService.getByCategory(categoryId).subscribe({
      next: products => {
        this.relatedProducts.set(
          products.filter(p => p.idProducto !== excludeId).slice(0, 3)
        );
      },
      error: () => {}
    });
  }
}
