import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  Edit3,
  LucideAngularModule,
  Plus,
  Search,
  Tags,
  Trash2
} from 'lucide-angular';

import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  readonly categories = signal<Category[]>([]);
  readonly filteredCategories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');

  readonly editIcon = Edit3;
  readonly plusIcon = Plus;
  readonly searchIcon = Search;
  readonly tagsIcon = Tags;
  readonly trashIcon = Trash2;

  ngOnInit(): void {
    this.loadCategories();
  }

  onSearch(value: string): void {
    const term = value.trim().toLowerCase();
    this.searchTerm.set(term);

    if (!term) {
      this.filteredCategories.set(this.categories());
      return;
    }

    const filtered = this.categories().filter(category =>
      category.nombre.toLowerCase().includes(term) ||
      category.descripcion.toLowerCase().includes(term)
    );

    this.filteredCategories.set(filtered);
  }

  deleteCategory(category: Category): void {
    const confirmed = confirm(
      `¿Deseas eliminar la categoría "${category.nombre}"?`
    );

    if (!confirmed) {
      return;
    }

    this.categoryService.delete(category.idCategoria).subscribe({
      next: () => {
        const updated = this.categories().filter(
          item => item.idCategoria !== category.idCategoria
        );

        this.categories.set(updated);
        this.filteredCategories.set(updated);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
      }
    });
  }

  private loadCategories(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.categoryService.getAll().subscribe({
      next: categories => {
        this.categories.set(categories);
        this.filteredCategories.set(categories);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      }
    });
  }
}
