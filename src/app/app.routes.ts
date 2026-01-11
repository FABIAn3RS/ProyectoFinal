import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Interfazrevistas } from './interfazrevistas/interfazrevistas';
import { Plantilla } from './plantilla/plantilla';
import { Buscador } from './buscador/buscador';
import { Envio } from './envio/envio';
import { Perfil } from './perfil/perfil';
import { Login } from './login/login';
import { Signin } from './signin/signin';
import { authGuard } from './signin/authguard/authguard';
import { Updatepassword } from './updatepassword/updatepassword';
import { Resetpassword } from './updatepassword/resetpassword/resetpassword';

export const routes: Routes = [

    { path: '', component: Main },
    { path: "interfaz", component: Interfazrevistas },
    { path: "revista/:id", component: Plantilla },
    { path: "buscador", component: Buscador },
    { path: "Envio", component: Envio, canActivate: [authGuard] },
    { path: "login", component: Login },
    { path: "Perfil", component: Perfil, canActivate: [authGuard] },
    { path: "Registro", component: Signin },
    { path: "Recuperacion", component: Updatepassword },
    { path: "Reset", component: Resetpassword },

];
