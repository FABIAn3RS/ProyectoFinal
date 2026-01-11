import { Component } from '@angular/core';

@Component({
  selector: 'app-interfazrevistas',
  imports: [],
  templateUrl: './interfazrevistas.html',
  styleUrl: './interfazrevistas.css',
})
export class Interfazrevistas {



}

export interface Revistaplantilla {
  id: string;
  titulo: string;
  autor: string;
  universidad: string;
  categoria: string;
  fecha: string;
  resumen: string;
  status: string;
}


