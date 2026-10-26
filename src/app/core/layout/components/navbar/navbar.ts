import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth-service';

@Component({
  imports: [],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {

  ngOnInit(): void {
    
    if(this.authService.usuarioActual()?.rol != null){

      this.rol.set(this.authService.usuarioActual()!.rol);
    }
  }

  private authService = inject(AuthService);
  rol = signal<string>("");

  rolInicial = computed(() => this.rol().charAt(0));

}
