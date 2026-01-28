import { Component, signal, computed } from '@angular/core';
import { SupabaseService } from '../services/SupabaseService';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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

  constructor(private supa: SupabaseService, private router: Router, private http: HttpClient) { }

  // Capturar archivos desde el evento (input)
  onFileSelected(event: any, type: 'pdf' | 'img') {
    const file = event.target.files[0];
    if (type === 'pdf') this.filePDF = file;
    else this.filePortada = file;
  }

  camposcompletos = computed(() => {

    if (this.titulo() && this.autor() && this.categoria() && this.universidad() && this.resumen()) {


      return true
    }

    return false



  })

  async enviarArticulo() {


    //esta es la variable que ocntrola el bloqueo del boton para evita clicks accidentale


    this.loading.set(true);


    try {

      //validaciones

      if (!this.camposcompletos()) return alert("Completa los campos")

      if (this.titulo().length > 200 || this.titulo().length < 10) return alert('Titulo inconsistente o muy extenso')

      if (this.autor().length > 200 || this.autor().length < 5) return alert('Autor(es) inconsistentes o muy extenso')

      if (this.universidad().length > 50 || this.universidad().length < 5) return alert('Universidad Invalida')

      if (this.resumen().length > 600 || this.resumen().length < 50) return alert("Resumen inconsistente o muy extenso (min 50 max 600 chrc)")

      if (!this.filePDF || !this.filePortada) return alert("Sube ambos archivos");

      //validacion de limite de subida desde la base de datos

      if (await this.supa.checkUserSubmissionLimit()) return;

      const user_id = await this.supa.getuserID();


      //se crea el objeto con los datos a enviar

      const revistaData = {
        titulo: this.titulo(),
        autor: this.autor(),
        universidad: this.universidad(),
        categoria: this.categoria(),
        resumen: this.resumen(),
        fecha: new Date().toISOString(),
        user_id: user_id
      };

      // Guardar datos en la tabla 'revistas' y obtener el id generado, se usa para eliminarla en caso de fallar la subida de archivos


      const { idFinal, nombrepdf, nombreimg, revistasubida } = await this.supa.insertRevista(revistaData);

      //n8n8

      //PARTE DE AUTOMATIZACION CON N8N 

      try {
        const webhook = "http://localhost:5678/webhook-test/valorar"

        const result = await firstValueFrom(this.http.post(webhook, revistasubida));

        console.log("enviando a n8n:", result)



      } catch (error) {

        console.log("error en subida a N8N")
        await this.supa.eliminarRevista(idFinal)
        return
      }



      //PARTE DE SUBIR LOS ARCHIVOS A BUCKETS COMPARTIENDO EL ID DE LA REVISTA COMO NOMBRE

      try {

        //intenta subir los archivos

        await this.supa.insertIMGandPDF(nombrepdf, nombreimg, this.filePortada, this.filePDF);

        console.log(revistaData.user_id)
        console.log('Archivo subido con exito')

      } catch (error) {

        //si falla va a eliminar la tabla recien insertada

        await this.supa.eliminarRevista(idFinal)
        console.log('fallo en la subida de archivos')
        return

      }

      //luego se ejecuta una funcion para subir los archivos

      console.log("Enviando:", this.titulo(), this.filePDF.name, this.filePortada.name, this.autor(),
        this.universidad(), this.categoria(), this.resumen());

      alert("¡Artículo enviado con éxito!");

      //this.router.navigate(['/']);

    } catch (error) {
      console.error("Error al enviar el artículo:", error);
      alert("Error al enviar");
      this.loading.set(false);

    } finally {
      this.loading.set(false);
    }
  }

}


