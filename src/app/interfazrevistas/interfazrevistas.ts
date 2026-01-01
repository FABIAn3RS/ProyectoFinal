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
  archivo: string;
  fecha: string;
  resumen: string;
  portada: string;


}

export class Revistas {

  articles: Revistaplantilla[] = [
    {
      id: "revista1",
      titulo: "Inteligencia Artificial en la Medicina Moderna",
      autor: "Dr. Carlos Andrade",
      universidad: "Universidad Central del Ecuador",
      categoria: "Salud",
      archivo: "assets/archivos/revista1.pdf",
      fecha: "2022-05-18",
      resumen: "Análisis del uso de algoritmos de inteligencia artificial para el diagnóstico temprano y la personalización de tratamientos médicos.",
      portada: "/assets/images/rev1.jpg"
    },
    {
      id: "revista2",
      titulo: "Energías Renovables y Sostenibilidad Ambiental",
      autor: "Dr. María López",
      universidad: "Universidad de Guayaquil",
      categoria: "Medio Ambiente",
      archivo: "assets/archivos/revista2.pdf",
      fecha: "2022-05-18",
      resumen: "Análisis del uso de algoritmos de inteligencia artificial para el diagnóstico temprano y la personalización de tratamientos médicos.",
      portada: "/assets/images/rev2.jpg"
    },
    {
      id: "revista3",
      titulo: "Inteligencia Artificial en la Medicina Moderna",
      autor: "Dr. Carlos Andrade",
      universidad: "Universidad Central del Ecuador",
      categoria: "Salud",
      archivo: "assets/archivos/revista1.pdf",
      fecha: "2022-05-18",
      resumen: "Análisis del uso de algoritmos de inteligencia artificial para el diagnóstico temprano y la personalización de tratamientos médicos.",
      portada: "/assets/images/rev3.jpg"
    },
    {
      id: "revista4",
      titulo: "Inteligencia Artificial en la Medicina Moderna",
      autor: "Dr. Carlos Andrade",
      universidad: "Universidad Central del Ecuador",
      categoria: "Salud",
      archivo: "assets/archivos/revista1.pdf",
      fecha: "2022-05-18",
      resumen: "Análisis del uso de algoritmos de inteligencia artificial para el diagnóstico temprano y la personalización de tratamientos médicos.",
      portada: "/assets/images/rev4.jpg"
    },
    {
      id: "revista5",
      titulo: "Inteligencia Artificial en la Medicina Moderna",
      autor: "Dr. Carlos Andrade",
      universidad: "Universidad Central del Ecuador",
      categoria: "Salud",
      archivo: "assets/archivos/revista1.pdf",
      fecha: "2022-05-18",
      resumen: "Análisis del uso de algoritmos de inteligencia artificial para el diagnóstico temprano y la personalización de tratamientos médicos.",
      portada: "/assets/images/rev5.jpg"
    }

  ];



}
