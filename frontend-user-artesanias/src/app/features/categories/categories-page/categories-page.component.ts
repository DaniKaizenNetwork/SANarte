import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Category } from '../../../core/models/category.model';
import { PublicCategoryService } from '../../../core/services/public-category.service';

const CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=560&fit=crop',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=560&fit=crop',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=560&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=560&fit=crop',
  'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&h=560&fit=crop',
  'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&h=560&fit=crop'
];

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss'
})
export class CategoriesPageComponent implements OnInit {
  private readonly categoryService = inject(PublicCategoryService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: cats => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías.');
        this.loading.set(false);
      }
    });
  }

  getCategoryImage(index: number): string {
    return CATEGORY_IMAGES[index % CATEGORY_IMAGES.length];
  }
}
