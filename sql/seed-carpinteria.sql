-- =============================================================================
-- seed-carpinteria.sql
-- Datos de prueba limpios para el módulo de Carpintería
-- =============================================================================

BEGIN;

-- ---------- 1. Usuarios Iniciales ----------
INSERT INTO "Usuarios" ("Nombre", "Apellido", "NombreUsuario", "Contraseña", "Rol")
SELECT 'Admin', 'Principal', 'admin', 'admin123', 'Administrador'
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE "NombreUsuario" = 'admin');

INSERT INTO "Usuarios" ("Nombre", "Apellido", "NombreUsuario", "Contraseña", "Rol")
SELECT 'Carlos', 'Operador', 'carlos.op', '123456', 'Operador'
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE "NombreUsuario" = 'carlos.op');

INSERT INTO "Usuarios" ("Nombre", "Apellido", "NombreUsuario", "Contraseña", "Rol")
SELECT 'Maria', 'Supervisora', 'maria.sup', '123456', 'Supervisor'
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE "NombreUsuario" = 'maria.sup');


-- ---------- 2. Proveedores (Carpintería) ----------
INSERT INTO "Proveedores" ("Id", "NombreEmpresa", "Contacto", "Telefono") 
SELECT 1, 'Maderera Los Andes S.R.L.', 'Carlos Mamani', '70123456'
WHERE NOT EXISTS (SELECT 1 FROM "Proveedores" WHERE "Id" = 1);

INSERT INTO "Proveedores" ("Id", "NombreEmpresa", "Contacto", "Telefono") 
SELECT 2, 'Ferretería El Tornillo', 'Rosa Quispe', '71234567'
WHERE NOT EXISTS (SELECT 1 FROM "Proveedores" WHERE "Id" = 2);

INSERT INTO "Proveedores" ("Id", "NombreEmpresa", "Contacto", "Telefono") 
SELECT 3, 'Pinturas y Barnices del Sur', 'Luis Fernández', '72345678'
WHERE NOT EXISTS (SELECT 1 FROM "Proveedores" WHERE "Id" = 3);

INSERT INTO "Proveedores" ("Id", "NombreEmpresa", "Contacto", "Telefono") 
SELECT 4, 'Abrasivos y Herramientas Tarija', 'Marta Vaca', '73456789'
WHERE NOT EXISTS (SELECT 1 FROM "Proveedores" WHERE "Id" = 4);

SELECT setval(pg_get_serial_sequence('"Proveedores"', 'Id'), (SELECT MAX("Id") FROM "Proveedores"));


-- ---------- 3. Insumos (Materia Prima de Carpintería) ----------
INSERT INTO "Insumos" ("Id", "Nombre", "UnidadMedida", "StockActual", "StockMinimo", "CostoPromedio") 
SELECT 1, 'Madera de Pino', 'm³', 25, 10, 45.50
WHERE NOT EXISTS (SELECT 1 FROM "Insumos" WHERE "Id" = 1);

INSERT INTO "Insumos" ("Id", "Nombre", "UnidadMedida", "StockActual", "StockMinimo", "CostoPromedio") 
SELECT 2, 'Tornillos para Madera 3"', 'caja', 50, 20, 8.90
WHERE NOT EXISTS (SELECT 1 FROM "Insumos" WHERE "Id" = 2);

INSERT INTO "Insumos" ("Id", "Nombre", "UnidadMedida", "StockActual", "StockMinimo", "CostoPromedio") 
SELECT 3, 'Clavos de Acero', 'kg', 100, 30, 5.20
WHERE NOT EXISTS (SELECT 1 FROM "Insumos" WHERE "Id" = 3);

INSERT INTO "Insumos" ("Id", "Nombre", "UnidadMedida", "StockActual", "StockMinimo", "CostoPromedio") 
SELECT 4, 'Laca para Madera', 'L', 15, 5, 32.00
WHERE NOT EXISTS (SELECT 1 FROM "Insumos" WHERE "Id" = 4);

INSERT INTO "Insumos" ("Id", "Nombre", "UnidadMedida", "StockActual", "StockMinimo", "CostoPromedio") 
SELECT 5, 'Barniz Al Agua', 'L', 8, 3, 45.00
WHERE NOT EXISTS (SELECT 1 FROM "Insumos" WHERE "Id" = 5);

INSERT INTO "Insumos" ("Id", "Nombre", "UnidadMedida", "StockActual", "StockMinimo", "CostoPromedio") 
SELECT 6, 'Lija P120', 'hojas', 200, 50, 1.80
WHERE NOT EXISTS (SELECT 1 FROM "Insumos" WHERE "Id" = 6);

SELECT setval(pg_get_serial_sequence('"Insumos"', 'Id'), (SELECT MAX("Id") FROM "Insumos"));


-- ---------- 4. Productos Terminados (Muebles / Carpintería) ----------
INSERT INTO "Productos" ("Nombre", "Precio", "Descripcion")
VALUES
    ('Mesa de Comedor de Pino 6 Sillas', 450.00, 'Mesa familiar elaborada en madera de pino maciza con acabado en laca'),
    ('Silla Ergonómica de Madera', 85.00, 'Silla individual de pino reforzada con tornillos y tarugos'),
    ('Estantería Organizadora 5 Niveles', 220.00, 'Librero o repisa alta de madera para oficina u hogar');


-- ---------- 5. Compras de Insumos Registradas ----------
TRUNCATE TABLE "ComprasInsumo" RESTART IDENTITY CASCADE;

INSERT INTO "ComprasInsumo" ("UsuarioId", "InsumoId", "ProveedorId", "Fecha", "PrecioUnitario", "Cantidad") VALUES
    (1, 1, 1, NOW() - INTERVAL '6 days', 45.50,  20),
    (1, 2, 2, NOW() - INTERVAL '5 days',  8.90,  30),
    (1, 3, 2, NOW() - INTERVAL '4 days',  5.20,  40),
    (1, 4, 3, NOW() - INTERVAL '3 days', 32.00,  10),
    (1, 5, 3, NOW() - INTERVAL '2 days', 45.00,   6),
    (1, 6, 4, NOW() - INTERVAL '1 days',  1.80, 100);


-- ---------- 6. Recetas para los Productos de Carpintería ----------
-- Receta para Producto 1: Mesa de Comedor (Id: 1)
INSERT INTO "Recetas" ("ProductoId") VALUES (1);

INSERT INTO "RecetasDetalle" ("RecetaId", "InsumoId", "CantidadNecesaria")
VALUES
    (1, 1, 3),   -- 3 m³ de Madera de Pino
    (1, 2, 2),   -- 2 cajas de tornillos
    (1, 4, 1);   -- 1 L de laca

-- Receta para Producto 2: Silla de Madera (Id: 2)
INSERT INTO "Recetas" ("ProductoId") VALUES (2);

INSERT INTO "RecetasDetalle" ("RecetaId", "InsumoId", "CantidadNecesaria")
VALUES
    (2, 1, 1),   -- 1 m³ de Madera de Pino
    (2, 2, 1),   -- 1 caja de tornillos
    (2, 6, 5);   -- 5 hojas de lija P120


-- ---------- 7. Órdenes de Producción ----------
INSERT INTO "OrdenesProduccion" ("UsuarioId", "ProductoId", "Fecha", "CantidadSolicitada", "Estado")
VALUES
    (2, 1, NOW() - INTERVAL '2 days', 5, 'Completado'),
    (2, 2, NOW() - INTERVAL '1 day', 15, 'En Proceso'),
    (2, 3, NOW(), 4, 'Pendiente');


-- ---------- 8. Mermas Registradas en Producción ----------
INSERT INTO "Mermas" ("InsumoId", "OrdenProduccionId", "CantidadPerdida", "Motivo")
VALUES
    (1, 1, 0.5, 'Corte con defecto por nudo desprendido en la madera'),
    (6, 2, 2,   'Desgaste excesivo de lijas en acabado preliminar');

COMMIT;