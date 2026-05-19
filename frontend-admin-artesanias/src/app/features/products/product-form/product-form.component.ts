import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ArrowLeft,
  ImagePlus,
  LucideAngularModule,
  Save
} from 'lucide-angular';

import { Observable } from 'rxjs';

import { Category } from '../../../core/models/category.model';
import {
  ProductRequest,
  ProductStatus
} from '../../../core/models/product.model';

import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    LucideAngularModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  readonly categories$: Observable<Category[]> = this.categoryService.getAll();

  readonly form = this.fb.nonNullable.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.maxLength(150)
      ]
    ],
    detalle: [
      '',
      [
        Validators.required,
        Validators.maxLength(1000)
      ]
    ],
    precio: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],
    imagenUrl: [''],
    estado: [
      'DISPONIBLE' as ProductStatus,
      [
        Validators.required
      ]
    ],
    idCategoria: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]
  });

  productId: number | null = null;
  isSaving = false;
  isLoading = false;
  submitted = false;
  errorMessage = '';

  readonly arrowLeftIcon = ArrowLeft;
  readonly imagePlusIcon = ImagePlus;
  readonly saveIcon = Save;

  get isEditMode(): boolean {
    return this.productId !== null;
  }

  get title(): string {
    return this.isEditMode ? 'Edit Product' : 'Crear Nuevo Producto';
  }

  get subtitle(): string {
    return this.isEditMode
      ? 'Update the details, pricing, and availability of this artisanal piece.'
      : 'Añade una nueva pieza artesanal al catálogo. Asegúrate de proporcionar detalles precisos y fotografías de alta calidad.';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id ? Number(id) : null;

    if (this.productId) {
      this.loadProduct(this.productId);
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

    const payload: ProductRequest = {
      nombre: raw.nombre.trim(),
      detalle: raw.detalle.trim(),
      precio: Number(raw.precio),
      imagenUrl: raw.imagenUrl.trim() || null,
      estado: raw.estado,
      idCategoria: Number(raw.idCategoria)
    };

    const request$ = this.productId
      ? this.productService.update(this.productId, payload)
      : this.productService.create(payload);

    request$.subscribe({
      next: () => {
        this.router.navigateByUrl('/productos');
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isSaving = false;
      }
    });
  }

  isInvalid(
    controlName:
      | 'nombre'
      | 'detalle'
      | 'precio'
      | 'estado'
      | 'idCategoria'
      | 'imagenUrl'
  ): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }

  private loadProduct(id: number): void {
    this.isLoading = true;

    this.productService.getById(id).subscribe({
      next: product => {
        this.form.patchValue({
          nombre: product.nombre,
          detalle: product.detalle,
          precio: product.precio,
          imagenUrl: product.imagenUrl ?? '',
          estado: product.estado,
          idCategoria: product.categoria.idCategoria
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
