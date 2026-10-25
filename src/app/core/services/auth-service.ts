import { inject, Service, signal } from '@angular/core';
import { AuthResponse} from '../../models';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Service()
export class AuthService {

    /*
     private listaUsuarios = signal<Usuario[]>([

        {id:1, nombre:'Admin', apellido:'Principal', nombreUsuario:'admin', contraseña:'admin123', rol:'Administrador'},
        {id:2, nombre:'Carlos', apellido:'Operador', nombreUsuario:'carlos.op', contraseña:'123456', rol:'Operador'},
        {id:3, nombre:'Maria', apellido:'Supervisora', nombreUsuario:'maria.sup', contraseña:'123456', rol:'Supervisor'}

        const usuario = this.listaUsuarios().find(u => u.nombreUsuario === nombreUsuario && u.contraseña === contraseña );

        if (usuario){

            const datosUsuario : AuthResponse = {id:usuario.id, nombre:usuario.nombre, apellido:usuario.apellido, nombreUsuario:usuario.nombreUsuario, rol:usuario.rol}
            
            localStorage.setItem("protrack_sesion", JSON.stringify(datosUsuario));
        
            this.usuarioActual.set(usuario);

            return true;
        }

        return false;
    ]);
    */

    usuarioActual = signal<AuthResponse | null>(null);

    private http = inject(HttpClient);
    private url = `${API_CONFIG.BASE_URL}/api/Auth/login`;
    private router = inject(Router);

    constructor(){

        const sesionGuardada = localStorage.getItem("protrack_sesion");

        if (sesionGuardada){

            this.usuarioActual.set(JSON.parse(sesionGuardada));
        }
    }

    login(nombreUsuario : string, contraseña : string) : Observable<AuthResponse>{

        const credenciales = {username: nombreUsuario, password:contraseña};

        return this.http.post<AuthResponse>(this.url, credenciales).pipe(
        tap({
            next: (resultado) => {

                localStorage.setItem('protrack_sesion', JSON.stringify(resultado));
                this.usuarioActual.set(resultado);

            },
            error: (err) => {

                this.usuarioActual.set(null); 
            }
        })
    );
    }

    logout() : void{

        localStorage.removeItem("protrack_sesion");

        this.usuarioActual.set(null);

        this.router.navigate(['login']);
    }

}
