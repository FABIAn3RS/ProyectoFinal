import { Component, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/SupabaseService';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-resetpassword',
  imports: [RouterLink, FormsModule],
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.css',
})
export class Resetpassword {


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
        this.router.navigate(['/recuperar']); // Lo mandas de vuelta al inicio
      }
    });
  }

  hola() { console.log("hola") }




}




