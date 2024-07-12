import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, isLoggedIn } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UserSignup } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    RippleModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    if (isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.signupForm.valid) {
      this.loading = true;
      const user: UserSignup = this.signupForm.value;
      this.authService
        .register(user)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Usuário registrado com sucesso.',
            });
            this.clearForm();
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/signin']);
            }, 1600);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Erro ao registrar usuário.',
            });
          },
        })
        .add(() => {
          this.loading = false;
        });
    }
  }

  clearForm() {
    this.signupForm.reset();
    this.signupForm.markAsPristine();
    this.signupForm.markAsUntouched();
    Object.keys(this.signupForm.controls).forEach((key) => {
      this.signupForm.get(key)?.clearValidators();
      this.signupForm.get(key)?.updateValueAndValidity();
    });
  }
}
