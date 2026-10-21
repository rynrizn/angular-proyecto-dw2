export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  rol: string;
}
