import { Component, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/SupabaseService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-updatepassword',
  imports: [FormsModule, RouterLink],
  templateUrl: './updatepassword.html',
  styleUrl: './updatepassword.css',
})
export class Updatepassword {

  constructor(private router: Router, private supa: SupabaseService) { }

  email = signal("")

  emailValido = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email());
  });




  formularioValido = computed(() => {
    return this.emailValido()
  });

  errorLogin = signal("")

  async enviarEnlace() {
    try {
      // Esto envía el correo con el enlace mágico
      await this.supa.resetPassword(this.email());
      alert("Revisa tu bandeja de entrada (y el spam)");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }



}
