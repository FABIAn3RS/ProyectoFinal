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


    this.loading.set(true);


    try {

      if (!this.filePDF || !this.filePortada) return alert("Sube ambos archivos");

      if (await this.supa.checkUserSubmissionLimit()) return;


      //se crea el objeto con los datos a enviar

      const revistaData = {
        titulo: this.titulo(),
        autor: this.autor(),
        universidad: this.universidad(),
        categoria: this.categoria(),
        resumen: this.resumen(),
        fecha: new Date().toISOString(),
        status: 'REV'
      };

      // Guardar datos en la tabla 'revistas' y obtener el id generado, no se usa el id pero esta por si acaso


      const { idFinal, nombrepdf, nombreimg } = await this.supa.insertRevista(revistaData);

      //luego se ejecuta una funcion para subir los archivos

      await this.supa.insertIMGandPDF(nombrepdf, nombreimg, this.filePortada, this.filePDF);



      console.log("Enviando:", this.titulo(), this.filePDF.name, this.filePortada.name, this.autor(),
        this.universidad(), this.categoria(), this.resumen());
      alert("¡Artículo enviado con éxito!");

    } catch (error) {
      console.error("Error al enviar el artículo:", error);
      alert("Error al enviar");
      this.loading.set(false);

    } finally {
      this.loading.set(false);
    }
  }

}
