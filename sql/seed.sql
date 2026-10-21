-- ==============================================================================
-- Datos Iniciales / Semilla (Seed Data) para pruebas
-- Proyecto: Producción y Control de Inventario
-- ==============================================================================

-- 1. Usuarios iniciales
INSERT INTO "Usuarios" ("Nombre", "Apellido", "NombreUsuario", "Contraseña", "Rol")
VALUES
    ('Admin', 'Principal', 'admin', 'admin123', 'Administrador'),
    ('Carlos', 'Operador', 'carlos.op', '123456', 'Operador'),
    ('Maria', 'Supervisora', 'maria.sup', '123456', 'Supervisor')
ON CONFLICT ("NombreUsuario") DO NOTHING;

-- 2. Proveedores iniciales
INSERT INTO "Proveedores" ("NombreEmpresa", "Contacto", "Telefono")
VALUES
    ('Distribuidora San Martin S.R.L.', 'Pedro Sanchez', '70012345'),
    ('Molinos del Valle', 'Lucia Fernandez', '71098765'),
    ('Química Industrial S.A.', 'Jorge Vargas', '72054321');

-- 3. Insumos (Materia prima)
INSERT INTO "Insumos" ("Nombre", "UnidadMedida", "StockActual", "StockMinimo", "CostoPromedio")
VALUES
    ('Harina de Trigo Especial', 'kg', 500, 50, 4.50),
    ('Azúcar Refinada', 'kg', 250, 30, 5.00),
    ('Levadura Seca', 'kg', 40, 10, 25.00),
    ('Mantequilla Industrial', 'kg', 80, 15, 32.00),
    ('Sal Yodada', 'kg', 100, 10, 1.50);

-- 4. Productos terminados
INSERT INTO "Productos" ("Nombre", "Precio", "Descripcion")
VALUES
    ('Pan Molde Familiar 500g', 14.50, 'Pan de molde blanco enriquecido paquete familiar'),
    ('Galletas de Mantequilla 250g', 18.00, 'Galletas artesanales de mantequilla caja'),
    ('Pan Integral con Semillas 400g', 16.00, 'Pan integral saludable con semillas de linaza y chía');

-- 5. Compras de Insumos registradas
INSERT INTO "ComprasInsumo" ("UsuarioId", "InsumoId", "ProveedorId", "Fecha", "PrecioUnitario", "Cantidad")
VALUES
    (1, 1, 2, NOW() - INTERVAL '5 days', 4.50, 300),
    (1, 2, 1, NOW() - INTERVAL '4 days', 5.00, 150),
    (1, 4, 1, NOW() - INTERVAL '3 days', 32.00, 50);

-- 6. Recetas para los productos
-- Receta para Producto 1: Pan Molde Familiar (Id: 1)
INSERT INTO "Recetas" ("ProductoId") VALUES (1);

-- Detalles de Receta 1
INSERT INTO "RecetasDetalle" ("RecetaId", "InsumoId", "CantidadNecesaria")
VALUES
    (1, 1, 1),  -- 1 kg harina
    (1, 2, 1),  -- azúcar
    (1, 3, 1),  -- levadura
    (1, 5, 1);  -- sal

-- Receta para Producto 2: Galletas de Mantequilla (Id: 2)
INSERT INTO "Recetas" ("ProductoId") VALUES (2);

-- Detalles de Receta 2
INSERT INTO "RecetasDetalle" ("RecetaId", "InsumoId", "CantidadNecesaria")
VALUES
    (2, 1, 1),  -- harina
    (2, 2, 1),  -- azúcar
    (2, 4, 2);  -- mantequilla

-- 7. Órdenes de Producción
INSERT INTO "OrdenesProduccion" ("UsuarioId", "ProductoId", "Fecha", "CantidadSolicitada", "Estado")
VALUES
    (2, 1, NOW() - INTERVAL '2 days', 50, 'Completado'),
    (2, 1, NOW() - INTERVAL '1 day', 100, 'En Proceso'),
    (2, 2, NOW(), 80, 'Pendiente');

-- 8. Mermas registradas
INSERT INTO "Mermas" ("InsumoId", "OrdenProduccionId", "CantidadPerdida", "Motivo")
VALUES
    (1, 1, 2, 'Masa defectuosa por temperatura en horno'),
    (4, 2, 1, 'Derrame en mezcladora');
