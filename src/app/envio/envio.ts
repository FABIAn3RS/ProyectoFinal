import { Component, signal, computed } from '@angular/core';
import { SupabaseService } from '../services/SupabaseService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-envio',
  imports: [FormsModule],
  templateUrl: './envio.html',
  styleUrl: './envio.css',
})
export class Envio {

  categorias = ["", "Ciencia", "Sociales", "Teconologia",
    "Arte", "Salud", "Historia", "Literatura"]

  //Signals para textos
  titulo = signal('');
  autor = signal('');
  universidad = signal('');
  categoria = signal('');
  resumen = signal('');

  // Variables para archivos
  filePDF: File | null = null;
  filePortada: File | null = null;

  loading = signal(false);

  constructor(private supa: SupabaseService) { }

  // Capturar archivos desde el evento (input)
  onFileSelected(event: any, type: 'pdf' | 'img') {
    const file = event.target.files[0];
    if (type === 'pdf') this.filePDF = file;
    else this.filePortada = file;
  }

  async enviarArticulo() {
    if (!this.filePDF || !this.filePortada) return alert("Sube ambos archivos");

    this.loading.set(true);
    try {
      // 1. Subir PDF a Supabase Storage
      // 2. Subir Portada a Supabase Storage
      // 3. Guardar datos en la tabla 'revistas'
      //4. Desactivar el envio de formulario hasta que se complete el proceso de revision

      console.log("Enviando:", this.titulo(), this.filePDF.name, this.filePortada.name, this.autor(),
        this.universidad(), this.categoria(), this.resumen());
      alert("¡Artículo enviado con éxito!");

    } catch (error) {
      alert("Error al enviar");
    } finally {
      this.loading.set(false);
    }
  }

}
