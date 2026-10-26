-- =============================================================================
-- seed-carpinteria.sql
-- Datos de prueba de CARPINTERÍA para Proveedores, Insumos y ComprasInsumo.
--
-- Se ejecuta DESPUÉS de schema.sql y seed.sql. Se puede ejecutar varias veces.
-- Actualiza los registros existentes (no borra insumos ni proveedores, para no
-- romper recetas, mermas ni otros módulos) y reemplaza las compras de ejemplo.
-- Los datos son ficticios.
-- =============================================================================

BEGIN;

-- ---------- Proveedores ----------
INSERT INTO "Proveedores" ("Id", "NombreEmpresa", "Contacto", "Telefono") VALUES
    (1, 'Maderera Los Andes S.R.L.',        'Carlos Mamani',   '70123456'),
    (2, 'Ferretería El Tornillo',           'Rosa Quispe',     '71234567'),
    (3, 'Pinturas y Barnices del Sur',      'Luis Fernández',  '72345678'),
    (4, 'Abrasivos y Herramientas Tarija',  'Marta Vaca',      '73456789')
ON CONFLICT ("Id") DO UPDATE SET
    "NombreEmpresa" = EXCLUDED."NombreEmpresa",
    "Contacto"      = EXCLUDED."Contacto",
    "Telefono"      = EXCLUDED."Telefono";

SELECT setval(pg_get_serial_sequence('"Proveedores"', 'Id'), (SELECT MAX("Id") FROM "Proveedores"));

-- ---------- Insumos (los mismos 6 del inventario del Integrante 2) ----------
INSERT INTO "Insumos" ("Id", "Nombre", "UnidadMedida", "StockActual", "StockMinimo", "CostoPromedio") VALUES
    (1, 'Madera de Pino',           'm³',    25, 10, 45.50),
    (2, 'Tornillos para Madera 3"', 'caja',  50, 20,  8.90),
    (3, 'Clavos de Acero',          'kg',   100, 30,  5.20),
    (4, 'Laca para Madera',         'L',     15,  5, 32.00),
    (5, 'Barniz Al Agua',           'L',      8,  3, 45.00),
    (6, 'Lija P120',                'hojas', 200, 50,  1.80)
ON CONFLICT ("Id") DO UPDATE SET
    "Nombre"        = EXCLUDED."Nombre",
    "UnidadMedida"  = EXCLUDED."UnidadMedida",
    "StockActual"   = EXCLUDED."StockActual",
    "StockMinimo"   = EXCLUDED."StockMinimo",
    "CostoPromedio" = EXCLUDED."CostoPromedio";

SELECT setval(pg_get_serial_sequence('"Insumos"', 'Id'), (SELECT MAX("Id") FROM "Insumos"));

-- ---------- Compras de ejemplo (nada depende de esta tabla) ----------
TRUNCATE TABLE "ComprasInsumo" RESTART IDENTITY;

INSERT INTO "ComprasInsumo" ("UsuarioId", "InsumoId", "ProveedorId", "Fecha", "PrecioUnitario", "Cantidad") VALUES
    (1, 1, 1, NOW() - INTERVAL '6 days', 45.50,  20),
    (1, 2, 2, NOW() - INTERVAL '5 days',  8.90,  30),
    (1, 3, 2, NOW() - INTERVAL '4 days',  5.20,  40),
    (1, 4, 3, NOW() - INTERVAL '3 days', 32.00,  10),
    (1, 5, 3, NOW() - INTERVAL '2 days', 45.00,   6),
    (1, 6, 4, NOW() - INTERVAL '1 days',  1.80, 100);

COMMIT;