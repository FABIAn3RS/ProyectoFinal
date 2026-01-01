import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/SupabaseService';

//una funcion que se usa en routets, antes de entrar a una pagina verifica que este logeado , si no lo redirecciona a el login
// solo hay 2 paginas que usan esta funcion


export const authGuard = async () => {
    const supabaseService = inject(SupabaseService);
    const router = inject(Router);

    const isAuth = await supabaseService.isAuthenticated();

    if (isAuth) {
        return true;
    } else {
        return router.parseUrl('/login');
    }
};