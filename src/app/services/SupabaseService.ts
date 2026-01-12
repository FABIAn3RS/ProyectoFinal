//ESTE ES EL SERVICIO DE OBTENCION DE DATOS DE SUPABASE, DE LAS TABLAS

import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DBacces } from '../constantes/DBacces';

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

  //METODO PARA LAS MAS NUEVASS (TENDRA QUE SER UNA VISTA)

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


  // Método para extraer un artículo por su ID podria estar ligado a la tabla madre de revistas


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


  // Cambia el acceso o crea este método:
  async isAuthenticated(): Promise<boolean> {
    const { data } = await this.supabase.auth.getSession();
    return !!data.session; // Devuelve true si existe la sesión, false si no
  }




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


  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async signIn(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });

    if (error) throw error; // Si el usuario no existe o la clave está mal, lanzará el error
    return data;
  }
  async resetPassword(email: string) {

    const origin = window.location.origin;

    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      // Esta es la página de tu app donde el usuario elegirá su nueva clave
      redirectTo: `${origin}/Reset`,
    });
    if (error) throw error;
    return data;
  }


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
}

