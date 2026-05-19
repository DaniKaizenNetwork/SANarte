import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ArrowLeft,
  LucideAngularModule,
  Save,
  Tags
} from 'lucide-angular';

import { CategoryRequest } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);

  readonly form = this.fb.nonNullable.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.maxLength(500)
      ]
    ]
  });

  categoryId: number | null = null;
  isSaving = false;
  isLoading = false;
  submitted = false;
  errorMessage = '';

  readonly arrowLeftIcon = ArrowLeft;
  readonly saveIcon = Save;
  readonly tagsIcon = Tags;

  get isEditMode(): boolean {
    return this.categoryId !== null;
  }

  get title(): string {
    return this.isEditMode ? 'Editar Categoría' : 'Crear Categoría';
  }

  get subtitle(): string {
    return this.isEditMode
      ? 'Actualiza la información de esta categoría para mantener organizado tu catálogo.'
      : 'Añade una nueva categoría para clasificar tus artesanías por técnica, material o colección.';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryId = id ? Number(id) : null;

    if (this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  submit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.isSaving = true;

    const raw = this.form.getRawValue();

    const payload: CategoryRequest = {
      nombre: raw.nombre.trim(),
      descripcion: raw.descripcion.trim()
    };

    const request$ = this.categoryId
      ? this.categoryService.update(this.categoryId, payload)
      : this.categoryService.create(payload);

    request$.subscribe({
      next: () => {
        this.router.navigateByUrl('/categorias');
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isSaving = false;
      }
    });
  }

  isInvalid(controlName: 'nombre' | 'descripcion'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }

  private loadCategory(id: number): void {
    this.isLoading = true;

    this.categoryService.getById(id).subscribe({
      next: category => {
        this.form.patchValue({
          nombre: category.nombre,
          descripcion: category.descripcion
        });

        this.isLoading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }
}
