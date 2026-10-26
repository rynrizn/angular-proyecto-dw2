// src/environments/environment.ts
// ---------------------------------------------------------------------------
// Configuración de entorno para DESARROLLO.
//
// TODO (conexión backend):
//   Cuando el backend esté disponible, actualiza apiUrl con la URL real.
//   En producción usa environment.prod.ts con la URL del servidor desplegado.
//
//   Ejemplo de transición en los servicios:
//     private http = inject(HttpClient);
//     getProductos() { return this.http.get<Producto[]>(`${environment.apiUrl}/productos`); }
// ---------------------------------------------------------------------------
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5175',
};
