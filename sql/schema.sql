-- ==============================================================================
-- Script de Creación de Base de Datos y Tablas para PostgreSQL
-- Proyecto: Producción y Control de Inventario (ProTrack)
-- Base de Datos: Prueba
-- ==============================================================================

-- Si deseas crear la base de datos por separado:
-- CREATE DATABASE "Prueba";
-- \c "Prueba";

-- ------------------------------------------------------------------------------
-- 1. TABLA: Usuarios
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Usuarios" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL,
    "Apellido" VARCHAR(100) NOT NULL,
    "NombreUsuario" VARCHAR(50) NOT NULL UNIQUE,
    "Contraseña" VARCHAR(255) NOT NULL,
    "Rol" VARCHAR(50) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. TABLA: Productos
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Productos" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(150) NOT NULL,
    "Precio" NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    "Descripcion" TEXT
);

-- ------------------------------------------------------------------------------
-- 3. TABLA: Insumos (Materia Prima / Inventario)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Insumos" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(150) NOT NULL,
    "UnidadMedida" VARCHAR(50) NOT NULL,
    "StockActual" INTEGER NOT NULL DEFAULT 0,
    "StockMinimo" INTEGER NOT NULL DEFAULT 0,
    "CostoPromedio" NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- ------------------------------------------------------------------------------
-- 4. TABLA: Proveedores
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Proveedores" (
    "Id" SERIAL PRIMARY KEY,
    "NombreEmpresa" VARCHAR(150) NOT NULL,
    "Contacto" VARCHAR(100),
    "Telefono" VARCHAR(50)
);

-- ------------------------------------------------------------------------------
-- 5. TABLA: ComprasInsumo
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "ComprasInsumo" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER NOT NULL,
    "InsumoId" INTEGER NOT NULL,
    "ProveedorId" INTEGER NOT NULL,
    "Fecha" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "PrecioUnitario" NUMERIC(12, 2) NOT NULL,
    "Cantidad" INTEGER NOT NULL,
    CONSTRAINT "FK_ComprasInsumo_Usuarios" FOREIGN KEY ("UsuarioId")
        REFERENCES "Usuarios"("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_ComprasInsumo_Insumos" FOREIGN KEY ("InsumoId")
        REFERENCES "Insumos"("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_ComprasInsumo_Proveedores" FOREIGN KEY ("ProveedorId")
        REFERENCES "Proveedores"("Id") ON DELETE RESTRICT
);

-- ------------------------------------------------------------------------------
-- 6. TABLA: Recetas
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Recetas" (
    "Id" SERIAL PRIMARY KEY,
    "ProductoId" INTEGER NOT NULL,
    CONSTRAINT "FK_Recetas_Productos" FOREIGN KEY ("ProductoId")
        REFERENCES "Productos"("Id") ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 7. TABLA: RecetasDetalle
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "RecetasDetalle" (
    "Id" SERIAL PRIMARY KEY,
    "RecetaId" INTEGER NOT NULL,
    "InsumoId" INTEGER NOT NULL,
    "CantidadNecesaria" INTEGER NOT NULL,
    CONSTRAINT "FK_RecetasDetalle_Recetas" FOREIGN KEY ("RecetaId")
        REFERENCES "Recetas"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_RecetasDetalle_Insumos" FOREIGN KEY ("InsumoId")
        REFERENCES "Insumos"("Id") ON DELETE RESTRICT
);

-- ------------------------------------------------------------------------------
-- 8. TABLA: OrdenesProduccion
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "OrdenesProduccion" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER NOT NULL,
    "ProductoId" INTEGER NOT NULL,
    "Fecha" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "CantidadSolicitada" INTEGER NOT NULL,
    "Estado" VARCHAR(50) NOT NULL,
    CONSTRAINT "FK_OrdenesProduccion_Usuarios" FOREIGN KEY ("UsuarioId")
        REFERENCES "Usuarios"("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_OrdenesProduccion_Productos" FOREIGN KEY ("ProductoId")
        REFERENCES "Productos"("Id") ON DELETE RESTRICT
);

-- ------------------------------------------------------------------------------
-- 9. TABLA: Mermas
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Mermas" (
    "Id" SERIAL PRIMARY KEY,
    "InsumoId" INTEGER NOT NULL,
    "OrdenProduccionId" INTEGER NOT NULL,
    "CantidadPerdida" INTEGER NOT NULL,
    "Motivo" TEXT,
    CONSTRAINT "FK_Mermas_Insumos" FOREIGN KEY ("InsumoId")
        REFERENCES "Insumos"("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Mermas_OrdenesProduccion" FOREIGN KEY ("OrdenProduccionId")
        REFERENCES "OrdenesProduccion"("Id") ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- Índices para mejorar rendimiento de consultas y claves foráneas
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "IX_ComprasInsumo_UsuarioId" ON "ComprasInsumo"("UsuarioId");
CREATE INDEX IF NOT EXISTS "IX_ComprasInsumo_InsumoId" ON "ComprasInsumo"("InsumoId");
CREATE INDEX IF NOT EXISTS "IX_ComprasInsumo_ProveedorId" ON "ComprasInsumo"("ProveedorId");

CREATE INDEX IF NOT EXISTS "IX_Recetas_ProductoId" ON "Recetas"("ProductoId");
CREATE INDEX IF NOT EXISTS "IX_RecetasDetalle_RecetaId" ON "RecetasDetalle"("RecetaId");
CREATE INDEX IF NOT EXISTS "IX_RecetasDetalle_InsumoId" ON "RecetasDetalle"("InsumoId");

CREATE INDEX IF NOT EXISTS "IX_OrdenesProduccion_UsuarioId" ON "OrdenesProduccion"("UsuarioId");
CREATE INDEX IF NOT EXISTS "IX_OrdenesProduccion_ProductoId" ON "OrdenesProduccion"("ProductoId");

CREATE INDEX IF NOT EXISTS "IX_Mermas_InsumoId" ON "Mermas"("InsumoId");
CREATE INDEX IF NOT EXISTS "IX_Mermas_OrdenProduccionId" ON "Mermas"("OrdenProduccionId");
