import { Component, OnInit, inject, signal, computed } from '@angular/core';
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

  readonly categoryId = signal<number | null>(null);
  readonly isSaving = signal(false);
  readonly isLoading = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal('');

  readonly arrowLeftIcon = ArrowLeft;
  readonly saveIcon = Save;
  readonly tagsIcon = Tags;

  readonly isEditMode = computed(() => this.categoryId() !== null);



  readonly title = computed(() => this.isEditMode() ? 'Editar Categoría' : 'Crear Categoría');



  readonly subtitle = computed(() => this.isEditMode()
    ? 'Actualiza la información de esta categoría para mantener organizado tu catálogo.'
    : 'Añade una nueva categoría para clasificar tus artesanías por técnica, material o colección.'
  );


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryId.set(id ? Number(id) : null);

    const currentId = this.categoryId();
    if (currentId) {
      this.loadCategory(currentId);
    }
  }

  submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.errorMessage.set('');

    if (this.form.invalid) {
      return;
    }

    this.isSaving.set(true);

    const raw = this.form.getRawValue();

    const payload: CategoryRequest = {
      nombre: raw.nombre.trim(),
      descripcion: raw.descripcion.trim()
    };

    const currentId = this.categoryId();
    const request$ = currentId
      ? this.categoryService.update(currentId, payload)
      : this.categoryService.create(payload);

    request$.subscribe({
      next: () => {
        this.router.navigateByUrl('/categorias');
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.isSaving.set(false);
      }
    });
  }

  isInvalid(controlName: 'nombre' | 'descripcion'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  private loadCategory(id: number): void {
    this.isLoading.set(true);

    this.categoryService.getById(id).subscribe({
      next: category => {
        this.form.patchValue({
          nombre: category.nombre,
          descripcion: category.descripcion
        });

        this.isLoading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }
}
