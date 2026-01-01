import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/SupabaseService';
import { FormsModule } from '@angular/forms';
import { Signin } from '../signin/signin';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  email = signal("")
  password = signal("")

  emailValido = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email());
  });

  passwordValido = computed(() => this.password().length >= 6);


  formularioValido = computed(() => {
    return this.emailValido() &&
      this.passwordValido()
  });

  errorLogin = signal("")


  async Envioform() {

    if (!this.formularioValido()) return alert("Informacion vacio o incorrecta");

    try {
      const res = await this.supabaseService.signIn(
        this.email(),
        this.password()
      );

      // Si llegamos aquí, el usuario es válido
      console.log('Usuario verificado:', res.user);
      this.router.navigate(['/']); // Lo mandamos al buscador

    } catch (error: any) {
      // Si el correo no existe o la contraseña es incorrecta
      this.errorLogin.set('Credenciales inválidas o usuario no registrado');
      console.error('Error de acceso:', error.message);
    }
  }
}




