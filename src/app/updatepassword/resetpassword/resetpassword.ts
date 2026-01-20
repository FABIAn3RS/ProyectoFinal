import { Component, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/SupabaseService';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-resetpassword',
  imports: [FormsModule],
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.css',
})
export class Resetpassword implements OnInit {


  constructor(private router: Router, private supa: SupabaseService) { }


  password = signal("")
  passwordconf = signal("")

  passwordValido = computed(() => this.password().length >= 6);

  passwordconfirm = computed(() => this.passwordconf() == this.password())


  formularioValido = computed(() => {
    return this.passwordValido() && this.passwordconfirm()
  });

  ngOnInit() {
    // Verificamos si hay una sesión activa (el token del correo crea una)
    this.supa.isAuthenticated().then(isAuth => {
      if (!isAuth) {
        alert("Enlace inválido o expirado. Por favor, solicita uno nuevo.");
        this.router.navigate(['/Recuperacion']); // Lo mandas de vuelta al inicio
      }
    });
  }



  async actualizarPassword() {


    // Pequeño truco: esperamos a que la sesión se sincronice
    try {
      const { data, error } = await this.supa.updatePassword(this.password());

      if (error) throw error;

      alert("¡Contraseña cambiada!");
      this.router.navigate(['/']);
    } catch (error: any) {
      // Si sigue saliendo Auth session missing aquí, 
      // es que el enlace del correo no traía el token.
      alert("Error: " + error.message);
    }
  }

}




