import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../services/SupabaseService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})


export class Perfil {



  constructor(private supabase: SupabaseService, private router: Router) { }


  async logout() {



    try {
      await this.supabase.signOut();

      // Opcional: Si usas un signal de 'usuarioLogueado', ponlo en null
      // this.supabaseService.usuarioActual.set(null);

      // Redirigir al buscador o al login
      this.router.navigate(['/login']);

      alert('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }

  }






}


