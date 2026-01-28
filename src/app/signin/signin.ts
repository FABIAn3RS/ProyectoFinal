import { Component, signal, computed } from '@angular/core';
import { SupabaseService } from '../services/SupabaseService';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {


  constructor(private supabaseService: SupabaseService) { }


  email = signal('');
  password = signal('');
  passwordconf = signal("")
  nombreCompleto = signal('');
  universidad = signal('');



  //VALIDACIONES EN TIEMPO REAL 


  emailValido = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email());
  });


  passwordValido = computed(() => this.password().length >= 6);

  passwordconfirm = computed(() => this.passwordconf() == this.password())



  camposCompletos = computed(() => {
    return this.nombreCompleto().trim().length > 5 &&
      this.universidad().trim().length > 5;
  });


  //la validacion que tiene la ultima palabra sobre lo que se va a hacer, este computed controla el paso del usuario a la db
  formularioValido = computed(() => {
    return this.emailValido() &&
      this.passwordValido() &&
      this.camposCompletos() && this.passwordconfirm();
  });






  async registrarUsuario() {


    if (this.formularioValido()) {
      try {
        const res = await this.supabaseService.signUp(
          this.email(),
          this.password(),
          this.nombreCompleto(),
          this.universidad()
        );

        alert('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
        window.location.reload();

      } catch (error: any) {
        alert('Error al registrar: ' + error.message);
      }
    }
    else {

      alert("El formulario esta vacio o contiene datos incorrectos")


    }

  }

}
