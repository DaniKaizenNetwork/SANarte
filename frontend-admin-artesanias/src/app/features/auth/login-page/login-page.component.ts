import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  ArrowRight,
  EyeOff,
  LucideAngularModule,
  Lock,
  Mail,
  ShieldUser
} from 'lucide-angular';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: [
      'admin@artesanias.com',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '123456',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  submitted = false;

  readonly arrowRightIcon = ArrowRight;
  readonly eyeOffIcon = EyeOff;
  readonly lockIcon = Lock;
  readonly mailIcon = Mail;
  readonly shieldUserIcon = ShieldUser;

  submit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.router.navigateByUrl('/productos');
  }

  isInvalid(controlName: 'email' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted);
  }
}
