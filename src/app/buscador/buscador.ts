import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/SupabaseService';
import { Revistaplantilla } from '../interfazrevistas/interfazrevistas';
import { RouterLink } from '@angular/router';
import { DBacces } from '../constantes/DBacces';


@Component({
  selector: 'app-buscador',
  imports: [FormsModule, RouterLink],
  templateUrl: './buscador.html',
  styleUrl: './buscador.css',
})



export class Buscador {

  //Claves de acceso e incializacion de los atributos para guardar los datos
  //se usan signals para refrescar el buscador cada que se presiona una tecla por el signal+ngModel




  bucketurl = DBacces.suprabaseconteinerimg

  categorias = ["", "Ciencia", "Sociales", "Teconologia",
    "Arte", "Salud", "Historia", "Literatura"]

  selectcategoria = signal("")


  //el critetrio se ingresa en un input, el pertenece a un computed signal que 
  // ejecuta una funcion de buscador cada que se actualiza (osea cada que se presiona una tecla) y de esta manera
  // se puede prescindir de un boton de busqueda, el sistema funciona descargando TODOS los objetos (revistas) publicas
  // en la memoria para mostrarlos , de manera que no se tiene q pedir a la db en cada iteracion


  criterio_busqueda = signal("")


  //la interfaz que tienen que seguir
  protected revistas = signal<Revistaplantilla[]>([])





  //donde convergen las 3 signals y este bloque se ejecutara cada que haya un cambio en alguna y del lado del html tambien actualizara el bucle
  resultado = computed(() => {



    const termino = this.criterio_busqueda().toLowerCase().trim();
    const listacompleta = this.revistas()
    const categoria = this.selectcategoria().toLowerCase().trim()


    if (categoria == "") {

      const terminado = listacompleta.filter(revista => revista.titulo.toLowerCase().trim().includes(termino))

      return terminado

    } else if (categoria != "") {

      if (termino) {

        const terminado = listacompleta.filter(revista => revista.titulo.toLowerCase().trim().includes(termino))
        const cataplicada = terminado.filter(revistat => revistat.categoria.toLowerCase().trim().includes(categoria))
        return cataplicada


      } else {


        const slistacompleta1 = listacompleta.filter(revistat => revistat.categoria.toLowerCase().trim().includes(categoria))
        return slistacompleta1
      }




    }

    else {

      return listacompleta
    }
  });





  //esto ya ha estado en otros componentes, es para llamar los datos de la DB con inyeccion de servicios y 
  // y guardando los elementos en los atributos


  constructor(private supabase: SupabaseService) { }


  async ngOnInit() {

    const allelemnts = await this.supabase.getRevistas()

    this.revistas.set(allelemnts)

    console.log(allelemnts)

  }
}
