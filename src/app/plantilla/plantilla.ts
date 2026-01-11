import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../services/SupabaseService';
import { Revistaplantilla } from '../interfazrevistas/interfazrevistas';
import { DBacces } from '../constantes/DBacces';

@Component({
  selector: 'app-plantilla',
  imports: [],
  templateUrl: './plantilla.html',
  styleUrl: './plantilla.css',


})


//lo que hace en esencia este componente es leer el id de la ruta y con ese id extraer la revista de la base de datos, la id lo proporciona unicamente 
// los componentes tipo card de las secciones en las que se exponen las revistas

export class Plantilla implements OnInit {

  //Leer el id de la ruta

  articleId: string | null = null;

  //Inyectar el servicio de supabase y el activated route

  constructor(private route: ActivatedRoute, private supabaseService: SupabaseService) { }

  //Signal para la revista actual

  revista = signal<Revistaplantilla | null>(null);

  urldb = DBacces.suprabaseconteinerimg
  urldbpdf = DBacces.suprabaseconteinerpdf



  async ngOnInit() {

    // Obtener el ID del artículo desde la ruta

    const idprimaria = this.route.snapshot.paramMap.get('id');


    // Extraer el artículo por su ID

    if (idprimaria) {

      this.revista.set(await this.supabaseService.getArticleById(idprimaria));



    }



  }





}
