import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';

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
  Product,
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

  readonly productId = signal<number | null>(null);
  readonly isSaving = signal(false);
  readonly isLoading = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal('');

  readonly arrowLeftIcon = ArrowLeft;
  readonly imagePlusIcon = ImagePlus;
  readonly saveIcon = Save;

  readonly isEditMode = computed(() => this.productId() !== null);



  readonly title = computed(() => this.isEditMode() ? 'Edit Product' : 'Crear Nuevo Producto');



  readonly subtitle = computed(() => this.isEditMode()
    ? 'Update the details, pricing, and availability of this artisanal piece.'
    : 'Añade una nueva pieza artesanal al catálogo. Asegúrate de proporcionar detalles precisos y fotografías de alta calidad.'
  );


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const parsedId = id ? Number(id) : null;
    this.productId.set(
      parsedId !== null && Number.isFinite(parsedId) && parsedId > 0
        ? parsedId
        : null

    );

    const currentId = this.productId();
    if (currentId) {
      this.loadProduct(currentId);
    } else if (id) {
      this.errorMessage.set('El producto seleccionado no es válido.');
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

    const payload: ProductRequest = {
      nombre: raw.nombre.trim(),
      detalle: raw.detalle.trim(),
      precio: Number(raw.precio),
      imagenUrl: raw.imagenUrl.trim() || null,
      estado: raw.estado,
      idCategoria: Number(raw.idCategoria)
    };

    const currentId = this.productId();
    const request$ = currentId
      ? this.productService.update(currentId, payload)
      : this.productService.create(payload);

    request$.subscribe({
      next: () => {
        this.router.navigateByUrl('/productos');
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.isSaving.set(false);
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
    return control.invalid && (control.touched || this.submitted());
  }

  private loadProduct(id: number): void {
    this.isLoading.set(true);

    this.productService.getById(id).subscribe({
      next: product => {
        const idCategoria = this.getProductCategoryId(product);

        this.form.patchValue({
          nombre: product.nombre,
          detalle: product.detalle,
          precio: Number(product.precio),
          imagenUrl: product.imagenUrl ?? '',
          estado: product.estado,
          idCategoria
        });

        this.isLoading.set(false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  private getProductCategoryId(
    product: Product & {
      idCategoria?: number;
      categoria?: Category | null;
    }
  ): number {
    return product.categoria?.idCategoria ?? product.idCategoria ?? 0;
  }
}
