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
export class Plantilla implements OnInit {

  articleId: string | null = null;

  constructor(private route: ActivatedRoute, private supabaseService: SupabaseService) { }

  revista = signal<Revistaplantilla | null>(null);

  urldb = DBacces.suprabaseconteinerimg



  async ngOnInit() {

    const idprimaria = this.route.snapshot.paramMap.get('id');



    if (idprimaria) {

      this.revista.set(await this.supabaseService.getArticleById(idprimaria));



    }



  }





}
