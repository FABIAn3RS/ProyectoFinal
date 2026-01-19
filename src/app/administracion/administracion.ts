import { Component, signal, computed } from '@angular/core';
import { Revistaplantilla } from '../interfazrevistas/interfazrevistas';
import { SupabaseService } from '../services/SupabaseService';
import { FormsModule, NgModel } from '@angular/forms';
import { DBacces } from '../constantes/DBacces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-administracion',
  imports: [FormsModule,],
  templateUrl: './administracion.html',
  styleUrl: './administracion.css',
})
export class Administracion {


  idrevista = signal<any>("");
  nombrerevista = signal<any>("");
  usuariorevista = signal<any>("");

  tablasaprobadas = signal<Revistaplantilla[]>([])
  tablasenrevisios = signal<Revistaplantilla[]>([])
  tablausers = signal<any[]>([])

  LinkIMGApr = DBacces.suprabaseconteinerimg
  LinkIMGrevision = DBacces.suprabaseconteinerimgrev

  linkPDFApr = DBacces.suprabaseconteinerpdf
  linkPDFrevision = DBacces.suprabaseconteinerpdfrev

  pausebuttom = signal<boolean>(false);

  seccion = signal<"APROBADAS" | "REVISION" | 'USUARIOS'>("REVISION");


  //filtros de busqueda



  //POR NOMBRE

  revistasFiltradasporidapr = computed(() => {
    const termino = this.idrevista().toLowerCase();

    return this.tablasaprobadas().filter(r =>
      r.titulo?.toLowerCase().includes(termino) || r.id?.toUpperCase().includes(termino)
    );


  });

  revistasFiltradasporidrev = computed(() => {
    const termino = this.idrevista().toLowerCase();
    return this.tablasenrevisios().filter(r =>
      r.titulo?.toLowerCase().includes(termino) || r.id?.toUpperCase().includes(termino)
    );

  });


  usuariosfiltradosID = computed(() => {

    const termino = this.idrevista()
    const filtrada = this.tablausers().filter(u => u.id.includes(termino))

    return filtrada

  })




  constructor(private supaservice: SupabaseService,) { }



  async APRREVISTA(id: string | undefined, iduser: string | undefined) {

    this.pausebuttom.set(true);

    if (!id || !iduser) {
      console.error("ID de revista o ID de usuario no proporcionado.");
      this.pausebuttom.set(false);
      return;
    }


    try {

      await Promise.all([
        this.supaservice.moverEntreCarpetasdeREVaAPR(id, "PDF"),
        this.supaservice.moverEntreCarpetasdeREVaAPR(id, "base1"),
        this.supaservice.actualizarEstadoRevista(id, "APR"),
        this.supaservice.actualizarpermisoUsuario(iduser, true),
        this.ngOnInit()
      ])

      console.log("REVISTA APROBADA Y USUARIO HABILITADO PARA SUBIR NUEVAS REVISTAS");

      await this.ngOnInit();



    } catch (error) {
      console.error("Error en el proceso de aprobación:", error);

    } finally {
      this.pausebuttom.set(false);
    }


    //const id = this.idrevista().trim().toUpperCase();

    console.log("ID USUARIO A PERMITIR SUBIR: ", iduser);





    this.pausebuttom.set(false);
  }


  async RECHAZARREVISTA(id: string | undefined, iduser: string | undefined) {

    this.pausebuttom.set(true);

    if (!id || !iduser) {
      console.error("ID de revista o ID de usuario no proporcionado.");
      this.pausebuttom.set(false);
      return;
    }

    try {

      await Promise.all([
        this.supaservice.descartarrREVPDForIMG(id, "PDF", "REVISION"),
        this.supaservice.descartarrREVPDForIMG(id, "base1", "REVISION"),
        this.supaservice.eliminarRevista(id),
        this.supaservice.actualizarpermisoUsuario(iduser, true),
        this.ngOnInit()
      ]);

      console.log("REVISTA RECHAZADA Y USUARIO DESHABILITADO PARA SUBIR NUEVAS REVISTAS");

      await this.ngOnInit();


    } catch (error) {
      console.error("Error en el proceso de rechazo:", error);
    } finally {

      this.pausebuttom.set(false);
    }

  }


  async eliminarRevista(id: string | undefined) {

    this.pausebuttom.set(true);

    if (!id) {
      console.error("ID de revista no proporcionado.");
      this.pausebuttom.set(false);
      return;
    }

    try {

      await Promise.all([
        this.supaservice.descartarrREVPDForIMG(id, "PDF", "APROBADOS"),
        this.supaservice.descartarrREVPDForIMG(id, "base1", "APROBADOS"),
        this.supaservice.eliminarRevista(id),
        this.ngOnInit()
      ]);

      console.log("REVISTA ELIMINADA EXITOSAMENTE");

      await this.ngOnInit();


    } catch (error) {
      console.error("Error en el proceso de rechazo:", error);
    } finally {

      this.pausebuttom.set(false);
    }


  }


  async cambiarpermiso(iduser: string | undefined, statusnow: boolean) {

    this, this.pausebuttom.set(true);

    if (!iduser) {

      console.log('no ide de usuario')
      return
    }

    try {

      if (statusnow == true) {

        const data = await this.supaservice.actualizarpermisoUsuario(iduser, false)

      } else {

        const data = await this.supaservice.actualizarpermisoUsuario(iduser, true)
      }

      this.ngOnInit()

    } catch (error) {


      console.log('error cambiando el usuario')

    } finally {

      this.pausebuttom.set(false)
    }


  }


  async ngOnInit(): Promise<void> {

    const data = await this.supaservice.getRevistas();
    this.tablasaprobadas.set(data);

    const datarev = await this.supaservice.getRevistasREV();
    this.tablasenrevisios.set(datarev);

    const datauser = await this.supaservice.getUsers();
    this.tablausers.set(datauser)



    console.log("REVISTAS APROBADAS: ", data);
    console.log("REVISTAS EN REVISION: ", datarev);

  }
}

