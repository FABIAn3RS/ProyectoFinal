//ESTE ES EL SERVICIO DE OBTENCION DE DATOS DE SUPABASE, DE LAS TABLAS

import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DBacces } from '../constantes/DBacces';
import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  //INYECCION DEL CLIENTE DE SUPABASE

  private supabase: SupabaseClient;
  //CREDENCIALES DE ACCESO

  private supabaseUrl = DBacces.supabaseUrl;
  private supabaseKey = DBacces.supabaseKey;

  constructor() {
    // Sustituye con tus credenciales reales
    this.supabase = createClient(
      this.supabaseUrl,
      this.supabaseKey
    );
  }

  // Método para extraer todos los artículos DE UNA TABLA (REVIATAS GENERAL)
  async getRevistas() {
    const { data, error } = await this.supabase
      .from('revistas') // Nombre de tu tabla en Supabase
      .select('*');      // Extraer todas las columnas

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
      .select('*')     // Extraer todas las columnas
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
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      // Esta es la página de tu app donde el usuario elegirá su nueva clave
      redirectTo: 'http://localhost:4200/Reset',
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









}

