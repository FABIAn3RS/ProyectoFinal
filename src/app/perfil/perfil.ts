import { Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../services/SupabaseService';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})


export class Perfil {

  profile = signal<any>(null);
  name = signal<string>("");
  correo = signal<string>("");
  permiso = signal<any>(true);
  rol = signal<string>("");




  constructor(private supabase: SupabaseService, private router: Router) { }


  async ngOnInit() {

    this.profile.set(await this.supabase.getuserProfile());
    this.name.set(this.profile().nombre_completo);
    this.correo.set(this.profile().email);
    this.permiso.set(this.profile().upload_permission);
    this.rol.set(this.profile().rol);





  }





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


