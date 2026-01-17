//ESTE ES EL SERVICIO DE OBTENCION DE DATOS DE SUPABASE, DE LAS TABLAS

import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DBacces } from '../constantes/DBacces';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {



  //INYECCION DEL CLIENTE DE SUPABASE

  private supabase: SupabaseClient;
  //CREDENCIALES DE ACCESO

  private supabaseUrl = DBacces.supabaseUrl;
  private supabaseKey = DBacces.supabaseKey;
  private supabasebucketimagenes = DBacces.bucketNameImg;
  private supabasebucketpdf = DBacces.bucketNamePdf;


  constructor() {
    // Sustituye con tus credenciales reales
    this.supabase = createClient(
      this.supabaseUrl,
      this.supabaseKey
    );
  }

  // Método para extraer todos los artículos DE UNA TABLA (REVIATAS GENERAL) ES EL MAS USADO
  async getRevistas() {
    const { data, error } = await this.supabase
      .from('revistas') // Nombre de tu tabla en Supabase
      .select('*')
      .eq('status', 'APR');      // Extraer todas las columnas aprobadas

    if (error) {
      console.error('Error al extraer datos:', error);
      return [];
    }
    return data;
  }


  // Método para extraer todos los artículos EN REVISION DE UNA TABLA (REVIATAS GENERAL) ES USADO EN EL ADMIN 

  async getRevistasREV() {
    const { data, error } = await this.supabase
      .from('revistas') // Nombre de tu tabla en Supabase
      .select('*')
      .eq('status', 'REV');      // Extraer todas las columnas en revisión
    if (error) {
      console.error('Error al extraer datos:', error);
      return [];
    }
    return data;
  }

  //METODO PARA LAS MAS NUEVASS (TENDRA QUE SER UNA VISTA) DEVUELVE UNA LISTA

  async getnewrevistas() {
    const { data, error } = await this.supabase
      .from('revistas') // Nombre de tu tabla en Supabase
      .select('*')
      .eq('status', 'APR')     // Extraer todas las columnas aprobadas
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al extraer datos:', error);
      return [];
    }
    return data;
  }


  // Método para extraer un artículo por su ID podria estar ligado a la tabla madre de revistas DEVULEVE 1 SOLO ARTICULO


  async getArticleById(id: string) {
    const { data, error } = await this.supabase
      .from('revistas') // Nombre de tu tabla en Supabase
      .select('*')
      .eq('id', id)    // Filtrar por el ID del artículo
      .single();       // Obtener un solo registro  
    if (error) {
      console.error('Error al extraer datos:', error);
      return null;
    }
    return data
  }



  // VERIFICA SI HAY SESION ACTIVA

  async isAuthenticated(): Promise<boolean> {
    const { data } = await this.supabase.auth.getSession();
    return !!data.session; // Devuelve true si existe la sesión, false si no
  }

  //funcion para registrar usuarios


  async signUp(email: string, pass: string, nombre: string, universidad: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: pass,
      options: {
        // Estos datos viajan al campo 'raw_user_meta_data'
        // El Trigger que creamos los usará para llenar la tabla 'perfiles'
        data: {
          nombre: nombre,
          universidad: universidad
        }
      }
    });

    if (error) throw error;
    return data;
  }

  //funcion para cerrar sesion


  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  //funcion para iniciar sesion

  async signIn(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });

    if (error) throw error; // Si el usuario no existe o la clave está mal, lanzará el error
    return data;
  }


  //funcion para solicitar el reseteo de contraseña


  async resetPasswordrequest(email: string) {

    const origin = window.location.origin;

    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      // Esta es la página de tu app donde el usuario elegirá su nueva clave
      redirectTo: `${origin}/Reset`,
    });
    if (error) throw error;
    return data;
  }


  //funcion para actualizar la contraseña del usuario

  async updatePassword(newPassword: string) {


    // Retornamos la respuesta completa (con data y error)
    return await this.supabase.auth.updateUser({
      password: newPassword
    });
  }


  //guardar revista nueva en la tabla revistas y retornar el id generado para usarlo en el nombre de los archivos

  async insertRevista(revista: any) {
    const { data: revistasubida, error } = await this.supabase
      .from('revistas')
      .insert([revista])
      .select()
      .single();

    if (error) throw error;

    const idFinal = revistasubida.id;

    const nombrepdf = `${idFinal}.pdf`;
    const nombreimg = `${idFinal}.jpg`;

    console.log(idFinal, nombrepdf, nombreimg);

    return { idFinal, nombrepdf, nombreimg };


  }

  //funcion para subir los archivos a supabase storage usando el id generado de INSERT REVISTAS 

  async insertIMGandPDF(nombrepdf: string, nombreimg: string, imagen: File, pdf: File) {
    const { error: errorPDF } = await this.supabase.storage.from(this.supabasebucketpdf).upload(nombrepdf, pdf);
    const { error: errorImg } = await this.supabase.storage.from(this.supabasebucketimagenes).upload(nombreimg, imagen);
    if (errorPDF) throw errorPDF;
    if (errorImg) throw errorImg;


  }

  //CHECHA SI EXISTE YA UNA REVISTA EN REVISION PARA ESE USUARIO

  async checkUserSubmissionLimit(): Promise<boolean> {
    // 1. Obtener el usuario actual
    const { data: { user } } = await this.supabase.auth.getUser();

    if (!user) {
      alert("Debes iniciar sesión");
      return true; // Bloqueamos si no hay usuario
    }

    // 2. Consultar SOLO el perfil de este usuario
    const { data: perfil, error } = await this.supabase
      .from('perfiles')
      .select('upload_permission')
      .eq('id', user.id) // Filtramos por su ID directamente
      .single(); // Traemos solo un objeto, no un array

    if (error || !perfil) {
      console.error("Error al obtener perfil", error);
      return true;
    }

    // 3. Evaluar el permiso (asumiendo que upload_permission es booleano)
    if (perfil.upload_permission === true) {
      return false; // NO está limitado (puede subir)
    } else {
      alert("Ya tienes un artículo en revisión. Debes esperar a que sea procesado.");
      return true; // SÍ está limitado (no puede subir)
    }
  }

  //AVER ESTA FUNCION ES PARA OBTENER LSO DATOS DEL USUARIO GURDADOS EN EL NAVEGADOR, PARA MAS COMODIDAD

  async getuserProfile() {

    const { data: { session } } = await this.supabase.auth.getSession();

    if (!session?.user) {
      return null; // No hay usuario logueado
    }

    const userId = session.user.id;

    const { data: profile, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      return null;
    }
    return profile;
  }

  //OBTIENE EL USER CONTACTANDO CON LA NUBE (A DIFERENCIA DE LA DE ARRIBA QUE BUSCA LOCALMENTE)  Y DEVUELVE SI ES ADMIN O NO

  async getUSERISADMIN() {

    const { data: { user: usuario }, error } = await this.supabase.auth.getUser()
    if (error) throw error;

    const userid = usuario?.id;

    const { data: perfil, error: errorPerfil } = await this.supabase
      .from('perfiles')
      .select('rol')
      .eq('id', userid)
      .single();

    if (errorPerfil) throw errorPerfil;

    if (perfil.rol === 'admin') {
      return true;
    } else {
      return false;
    }

  }



  // !!!!funciones PARA APROBAR REVISTAS USADAS POR EL ADMINISTRADOR DESDE AQUI

  //MOVER LOS ARCHIVOS DE REVISION A APROBADOS SIRVE PARA AMBOS TIPOS DE ARCHIVOS PDF E IMAGENES, EL NOMBREBUCKET DEFINE CUAL ES EL DESTINO YA QUE SON 2 BICKETS PARA EL TIPO DE ARCHIVO

  async moverEntreCarpetasdeREVaAPR(idRevista: string | undefined, nombreBucket: "PDF" | "base1") {

    if (!idRevista) {
      console.warn("Operación cancelada: idRevista no definido.");
      return ""; // Retornamos un string vacío para mantener la consistencia del tipo de retorno
    }

    let urllist = "";

    try {

      // 1. Definimos la extensión según el bucket
      // Si el bucket es PDF, el archivo se llama ID.pdf
      // Si es base1 (portadas), supongo que es .jpg (o la que uses)
      const extension = (nombreBucket === "PDF") ? ".pdf" : ".jpg";

      // 2. Construimos las rutas EXACTAS (Carpeta/ID.extensión)
      const rutaOrigen = `REVISION/${idRevista}${extension}`;
      const rutaDestino = `APROBADOS/${idRevista}${extension}`;





      // 3. Copiar
      const { error: copyError } = await this.supabase.storage
        .from(nombreBucket)
        .copy(rutaOrigen, rutaDestino);

      if (copyError) {
        console.error("Error de Supabase:", copyError.message);
        // Si sale "Object not found", revisa si la extensión es .pdf o .PDF (mayúsculas)
        throw new Error(`No se encontró el archivo ${idRevista}${extension} en el bucket ${nombreBucket}`);
      }

      // 4. Eliminar el original
      await this.supabase.storage
        .from(nombreBucket)
        .remove([rutaOrigen]);

      // 5. Obtener nueva URL
      const { data: urllist1 } = this.supabase.storage
        .from(nombreBucket)
        .getPublicUrl(rutaDestino);

      urllist = urllist1.publicUrl;



    } catch { }

    return urllist;
  }

  //actualiza el estado de la revista en la tabla revistas para poder mostrarla en aprobadas

  async actualizarEstadoRevista(idRevista: string | undefined, nuevoEstado: "APR" | "REV") {


    if (!idRevista) {
      console.warn("Operación cancelada: idRevista no definido.");
      return ""; // Retornamos un string vacío para mantener la consistencia del tipo de retorno
    }

    const { error } = await this.supabase
      .from('revistas')
      .update({ status: nuevoEstado })
      .eq('id', idRevista);

    if (error) {
      console.error('Error al actualizar el estado de la revista:', error);
      throw error;
    }
    return "Estado actualizado correctamente";
  }

  //actualiza el estado de la revista en la tabla revistas para poder a darle permisos de subida al usuario otra vez


  async actualizarpermisoUsuario(idUsuario: string | undefined, permiso: boolean) {


    if (!idUsuario) {
      console.warn("Operación cancelada: idRevista no definido.");
      return ""; // Retornamos un string vacío para mantener la consistencia del tipo de retorno
    }

    const { error } = await this.supabase
      .from('perfiles')
      .update({ upload_permission: permiso })
      .eq('id', idUsuario);

    if (error) {
      console.error('Error al actualizar el permiso del usuario:', error);
      throw error;
    }
    return "Permiso actualizado correctamente";
  }




  // !!!!funciones PARA RECHAZAR REVISTAS USADAS POR EL ADMINISTRADOR DESDE AQUI

  //FUNCIONES PARA RECHAZAR REVISTAS USADAS POR EL ADMINISTRADOR  SIMPLEMENTE BORRA LOS ARCHIVOS DE REVISION CON LA LOGICA SIMILAR A LA DE ARRIBA

  async descartarrREVPDForIMG(idRevista: string | undefined, nombreBucket: "PDF" | "base1", carpetabucket: "REVISION" | "APROBADOS") {


    if (!idRevista) {
      console.warn("Operación cancelada: idRevista no definido.");
      return ""; // Retornamos un string vacío para mantener la consistencia del tipo de retorno
    }

    let urllist = "";



    try {
      // 1. Definimos la extensión según el bucket
      // Si el bucket es PDF, el archivo se llama ID.pdf
      // Si es base1 (portadas), supongo que es .jpg (o la que uses)
      const extension = (nombreBucket === "PDF") ? ".pdf" : ".jpg";

      // 2. Construimos las rutas EXACTAS (Carpeta/ID.extensión)
      const rutaOrigen = `${carpetabucket}/${idRevista}${extension}`;


      // 4. Eliminar el original
      await this.supabase.storage
        .from(nombreBucket)
        .remove([rutaOrigen]);

      // 5. Obtener nueva URL
      const { data: urllist1 } = this.supabase.storage
        .from(nombreBucket)
        .getPublicUrl(rutaOrigen);

      urllist = urllist1.publicUrl

    } catch { }

    return urllist;
  }
  async eliminarRevista(idRevista: string | undefined) {

    if (!idRevista) {
      console.warn("Operación cancelada: idRevista no definido.");
      return ""; // Retornamos un string vacío para mantener la consistencia del tipo de retorno
    }

    const { error } = await this.supabase
      .from('revistas')
      .delete()
      .eq('id', idRevista);

    if (error) {
      console.error('Error al eliminar la revista:', error);
      throw error;
    }
    return "Revista eliminada correctamente";
  }
}