import { Component, OnInit } from '@angular/core';
import { Revistaplantilla } from '../interfazrevistas/interfazrevistas';
import { RouterLink } from "@angular/router";
import { SupabaseService } from "../services/SupabaseService";
import { signal } from '@angular/core';
import { DBacces } from "../constantes/DBacces";

@Component({
  selector: 'app-main',
  imports: [RouterLink],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit {




  bucketimgurl = DBacces.suprabaseconteinerimg;


  //signal para actualizar las listas de revistas cuando recibe los datos


  protected poparticles = signal<Revistaplantilla[]>([]);

  protected articles = signal<Revistaplantilla[]>([]);


  constructor(private supabaseService: SupabaseService,) { }




  async ngOnInit() {


    //aqui se asignan los metodos para extraer las revistas

    const nuevos = await this.supabaseService.getnewrevistaslimit();

    //se cambia la funcion Para otra tabla
    const populares = await this.supabaseService.getRevistaslimit();

    this.articles.set(nuevos);
    this.poparticles.set(populares);

    console.log(this.articles);
    console.log(this.poparticles);


  }

}