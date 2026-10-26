import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  fb = inject(FormBuilder);
  router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    nombreUsuario: ["", [Validators.required]],
    contraseña: ["", [Validators.required, Validators.minLength(6)]]
  });

  authService = inject(AuthService);
  errorLogin = signal<string | null>(null);


  onSubmit(){

    if (this.loginForm.invalid){

      this.loginForm.markAllAsTouched();
      return;

    }

    const {nombreUsuario , contraseña} = this.loginForm.getRawValue();

    this.authService.login(nombreUsuario, contraseña).subscribe({
        next: (usuario) => {

            this.router.navigate(['/dashboard']); 

        },
        error: (err) => {

            if (err.status === 404) {
                this.errorLogin.set("Usuario o contraseña incorrectos.");
            } else {
                this.errorLogin.set("Hubo un problema con el servidor. Inténtalo más tarde.");
            }
            this.loginForm.reset();
        }
    });

    
  }
}
