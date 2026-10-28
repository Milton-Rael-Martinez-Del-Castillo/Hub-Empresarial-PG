SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS incuvalab
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

USE incuvalab;

-- -----------------------------
-- Tabla: Roles
-- -----------------------------
CREATE TABLE IF NOT EXISTS Rol (
    IdRol INT AUTO_INCREMENT PRIMARY KEY,
    NombreRol VARCHAR(50) NOT NULL UNIQUE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Rol (NombreRol) VALUES
('Admin'),
('Usuario');

-- -----------------------------
-- Tabla: Usuarios
-- -----------------------------
CREATE TABLE IF NOT EXISTS Usuario (
    IdUser INT AUTO_INCREMENT PRIMARY KEY,
    NombreUsuario VARCHAR(50) NOT NULL UNIQUE,
    Nombre VARCHAR(50) NOT NULL,
    PrimerApellido VARCHAR(50) NOT NULL,
    SegundoApellido VARCHAR(50) NULL,
    ImagenPerfil VARCHAR(255) NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    Contrasenia VARCHAR(255) NOT NULL,
    CodigoSecreto VARCHAR(255) NULL,
    DobleFactorActivo BOOLEAN DEFAULT FALSE,
    Telefono VARCHAR(20) NULL,
    Estado BOOLEAN DEFAULT TRUE,
    Id_Rol INT NOT NULL,
    FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Id_Rol) REFERENCES Rol(IdRol)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Usuario (
    NombreUsuario, Nombre, PrimerApellido, SegundoApellido,
    ImagenPerfil, Correo, Contrasenia, Id_Rol
) VALUES (
    'admin', 'Administrador', 'General', '', NULL,
    'landeschris10@gmail.com',
    '$2b$10$XHBZ7olz.s7XtMwNFbHRN.f3Jx69msk4f7W72HVXzOOhG7durfvwG', 1
);

-- -----------------------------
-- Tabla: Categorías
-- -----------------------------
CREATE TABLE IF NOT EXISTS Categoria (
    IdCategoria INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Categoria (Nombre) VALUES
('Tecnología'),('Innovación'),('Educación'),('Ciencia'),('Ingeniería'),
('Salud'),('Medio Ambiente'),('Arte y Cultura'),('Emprendimiento'),
('Software'),('Robótica'),('Inteligencia Artificial'),('Electrónica'),
('Social'),('Biotecnología');

-- -----------------------------
-- Tabla: Proyectos
-- -----------------------------
CREATE TABLE IF NOT EXISTS Proyecto (
    IdProyecto INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    DescripcionGeneral TEXT NULL,
    DescripcionCorta VARCHAR(255) NULL,
    ImagenPrincipal VARCHAR(255) NULL,
    Video VARCHAR(255) NULL,
    FechaInicio DATE NULL,
    FechaFin DATE NULL,
    FechaCaducacion DATE NULL,
    ContribuyenteLimite INT NOT NULL,
    EstadoAprobacion ENUM('Pendiente','Activo','Cancelado') DEFAULT 'Pendiente',
    EstadoActivo BOOLEAN DEFAULT TRUE,
    EstadoCierre ENUM('Activo','FinalizadoExitoso','FinalizadoIncompleto') DEFAULT 'Activo',
    IdCreador INT NOT NULL,
    IdCategoria INT NOT NULL,
    ResponsableNombre VARCHAR(100) NULL,
    ResponsableTelefono VARCHAR(20) NULL,
    FOREIGN KEY (IdCreador) REFERENCES Usuario(IdUser) ON DELETE CASCADE,
    FOREIGN KEY (IdCategoria) REFERENCES Categoria(IdCategoria)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------
-- Tabla: Asesorías
-- -----------------------------
CREATE TABLE IF NOT EXISTS Asesoria (
    IdAsesoria INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO Asesoria (Nombre) VALUES
('Asesoría financiera'),('Asesoría comercial'),('Asesoría en marketing'),
('Apoyo en valoración de empresas'),('Asesoría en gestión impositiva'),
('Asesoría en desarrollo de marca'),('Apoyo en desarrollo de packaging'),
('Apoyo en procesos de innovación'),('Asesoría en investigación de mercados'),
('Asesoría en procesos de exportación'),('Asesoría en procesos de importación'),
('Asesoría en apertura de mercados internacionales'),('Asesoría en gestión de equipos'),
('Asesoría en elevator pitch'),('Asesoría en costos y estructura contable');

-- -----------------------------
-- Relación Proyectos-Asesorías (muchos a muchos)
-- -----------------------------
CREATE TABLE IF NOT EXISTS Proyecto_Asesoria (
    IdProyecto INT NOT NULL,
    IdAsesoria INT NOT NULL,
    Completada BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (IdProyecto, IdAsesoria),
    FOREIGN KEY (IdProyecto) REFERENCES Proyecto(IdProyecto) ON DELETE CASCADE,
    FOREIGN KEY (IdAsesoria) REFERENCES Asesoria(IdAsesoria) ON DELETE CASCADE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------
-- Imágenes del Proyecto
-- -----------------------------
CREATE TABLE IF NOT EXISTS Proyecto_Imagen (
    IdImagen INT AUTO_INCREMENT PRIMARY KEY,
    IdProyecto INT NOT NULL,
    UrlImagen VARCHAR(255) NOT NULL,
    FechaSubida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdProyecto) REFERENCES Proyecto(IdProyecto) ON DELETE CASCADE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------
-- Documentos del Proyecto
-- -----------------------------
CREATE TABLE IF NOT EXISTS Proyecto_Documento (
    IdDocumento INT AUTO_INCREMENT PRIMARY KEY,
    IdProyecto INT NOT NULL,
    NombreDocumento VARCHAR(100) NOT NULL,
    UrlDocumento VARCHAR(255) NOT NULL,
    TipoDocumento ENUM('PDF','DOCX','XLSX','Otro') DEFAULT 'PDF',
    FechaSubida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdProyecto) REFERENCES Proyecto(IdProyecto) ON DELETE CASCADE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------
-- Relación Usuarios-Proyectos (Apoyos)
-- -----------------------------
CREATE TABLE IF NOT EXISTS Usuario_Proyecto (
    IdUser INT NOT NULL,
    IdProyecto INT NOT NULL,
    FechaAporte DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (IdUser, IdProyecto),
    FOREIGN KEY (IdUser) REFERENCES Usuario(IdUser) ON DELETE CASCADE,
    FOREIGN KEY (IdProyecto) REFERENCES Proyecto(IdProyecto) ON DELETE CASCADE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------
-- Comentarios
-- -----------------------------
CREATE TABLE IF NOT EXISTS Comentario (
    IdComentario INT AUTO_INCREMENT PRIMARY KEY,
    IdProyecto INT NOT NULL,
    IdUser INT NOT NULL,
    Texto TEXT NOT NULL,
    Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdProyecto) REFERENCES Proyecto(IdProyecto) ON DELETE CASCADE,
    FOREIGN KEY (IdUser) REFERENCES Usuario(IdUser) ON DELETE CASCADE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------
-- Notificaciones
-- -----------------------------
CREATE TABLE IF NOT EXISTS Notificacion (
    IdNotificacion INT AUTO_INCREMENT PRIMARY KEY,
    IdUser INT NOT NULL,
    IdProyecto INT NOT NULL,
    Tipo ENUM('Aporte','Comentario','MetaAlcanzada','ProyectoCerrado') NOT NULL,
    Mensaje TEXT NOT NULL,
    Leida BOOLEAN DEFAULT FALSE,
    Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdUser) REFERENCES Usuario(IdUser) ON DELETE CASCADE,
    FOREIGN KEY (IdProyecto) REFERENCES Proyecto(IdProyecto) ON DELETE CASCADE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------
-- Historial Usuario
-- -----------------------------
CREATE TABLE IF NOT EXISTS Usuario_Historial (
    IdHistorial INT AUTO_INCREMENT PRIMARY KEY,
    IdUser INT NOT NULL,
    FechaCreacion DATETIME NULL,
    FechaModificacion DATETIME NULL,
    ModificadoPor INT NULL,
    FechaCambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    TipoCambio ENUM('Insert','Update','Delete') NOT NULL,
    FOREIGN KEY (IdUser) REFERENCES Usuario(IdUser) ON DELETE CASCADE,
    FOREIGN KEY (ModificadoPor) REFERENCES Usuario(IdUser) ON DELETE SET NULL
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------
-- Historial Proyecto
-- -----------------------------
CREATE TABLE IF NOT EXISTS Proyecto_Historial (
    IdHistorial INT AUTO_INCREMENT PRIMARY KEY,
    IdProyecto INT NOT NULL,
    FechaCreacion DATETIME NULL,
    FechaModificacion DATETIME NULL,
    ModificadoPor INT NULL,
    FechaCambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    TipoCambio ENUM('Insert','Update','Delete') NOT NULL,
    FOREIGN KEY (IdProyecto) REFERENCES Proyecto(IdProyecto) ON DELETE CASCADE,
    FOREIGN KEY (ModificadoPor) REFERENCES Usuario(IdUser) ON DELETE SET NULL
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- -----------------------------
-- Tabla: Redes sociales por proyecto
-- -----------------------------
CREATE TABLE IF NOT EXISTS Proyecto_RedSocial (
    IdRed INT AUTO_INCREMENT PRIMARY KEY,
    IdProyecto INT NOT NULL,
    Url VARCHAR(255) NOT NULL,
    FechaAgregada DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdProyecto) REFERENCES Proyecto(IdProyecto) ON DELETE CASCADE
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 5 usuarios de prueba con la misma contraseña
-- ------------------------------------------------------
INSERT INTO Usuario (NombreUsuario, Nombre, PrimerApellido, SegundoApellido, Correo, Contrasenia, Id_Rol, FechaCreacion)
VALUES
('juanperez', 'Juan', 'Pérez', 'Gómez', 'juan.perez@incuvalab.com', '$2b$10$4wce.BUYVGvnig91NKZjCO0gp4V/02Upx405CIcFIweRHQSmCxv/u', 2, NOW()),
('mariarodriguez', 'María', 'Rodríguez', 'López', 'maria.rodriguez@incuvalab.com', '$2b$10$4wce.BUYVGvnig91NKZjCO0gp4V/02Upx405CIcFIweRHQSmCxv/u', 2, NOW()),
('carlosgarcia', 'Carlos', 'García', 'Martínez', 'carlos.garcia@incuvalab.com', '$2b$10$4wce.BUYVGvnig91NKZjCO0gp4V/02Upx405CIcFIweRHQSmCxv/u', 2, NOW()),
('anafernandez', 'Ana', 'Fernández', 'Suárez', 'ana.fernandez@incuvalab.com', '$2b$10$4wce.BUYVGvnig91NKZjCO0gp4V/02Upx405CIcFIweRHQSmCxv/u', 2, NOW()),
('luisramirez', 'Luis', 'Ramírez', 'Torres', 'luis.ramirez@incuvalab.com', '$2b$10$4wce.BUYVGvnig91NKZjCO0gp4V/02Upx405CIcFIweRHQSmCxv/u', 2, NOW());

-- ------------------------------------------------------
-- Proyectos activos para cada usuario (fecha fin a 1 año)
-- ------------------------------------------------------
INSERT INTO Proyecto (Nombre, DescripcionGeneral, DescripcionCorta, ImagenPrincipal, Video, FechaInicio, FechaFin, ContribuyenteLimite, EstadoAprobacion, EstadoActivo, EstadoCierre, IdCreador, IdCategoria, ResponsableNombre, ResponsableTelefono)
VALUES
('EcoTech Innovación', 
 'Proyecto dedicado a desarrollar soluciones tecnológicas sostenibles para reducir el impacto ambiental. Se enfoca en la creación de dispositivos y sistemas que minimicen el consumo energético y la producción de residuos, fomentando el uso de energías renovables y materiales reciclables. Se busca generar un impacto positivo en la comunidad y promover la educación ambiental a través de talleres y campañas de concienciación.', 
 'Soluciones verdes innovadoras.', 
 '/uploads/proyecto1.png', 
 'https://www.youtube.com/watch?v=t9paRh-fb8Q', 
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 100, 'Activo', TRUE, 'Activo', 2, 1, 'Juan Pérez', '77000001'),

('Aprendizaje Inteligente', 
 'Plataforma educativa basada en inteligencia artificial que adapta el contenido, ritmo y metodología según el perfil de cada estudiante. Permite evaluar el progreso en tiempo real, ofrecer recomendaciones personalizadas y fomentar la motivación a través de recompensas y gamificación. Además, integra herramientas de análisis de datos para que los docentes optimicen la enseñanza y mejoren los resultados académicos.', 
 'Educación adaptativa con IA.', 
 '/uploads/proyecto2.png', 
 'https://www.youtube.com/watch?v=YZzB1Uca7n0', 
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 80, 'Activo', TRUE, 'Activo', 3, 3, 'María Rodríguez', '77000002'),

('BioSalud Avanzada', 
 'Proyecto enfocado en innovación biotecnológica aplicada a la salud, mediante el desarrollo de diagnósticos rápidos, tratamientos personalizados y monitoreo de pacientes en tiempo real. Incluye investigación de vanguardia en genética y microbiología, con el objetivo de mejorar la calidad de vida y prevenir enfermedades a nivel comunitario. Se busca colaborar con instituciones de salud para implementar soluciones efectivas y sostenibles.', 
 'Biotecnología aplicada a la salud.', 
 '/uploads/proyecto3.png', 
 'https://www.youtube.com/watch?v=qjh-plnlB40', 
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 120, 'Activo', TRUE, 'Activo', 4, 6, 'Carlos García', '77000003'),

('Arte y Tecnología', 
 'Proyecto que combina arte y tecnología para generar experiencias culturales interactivas e inmersivas. Incluye desarrollo de instalaciones digitales, realidad aumentada y contenidos multimedia que promueven la creatividad y el aprendizaje cultural. Se busca acercar el arte a nuevas audiencias, fomentar la participación ciudadana y ofrecer herramientas innovadoras para artistas, educadores y gestores culturales.', 
 'Cultura digital interactiva.', 
 '/uploads/proyecto4.png', 
 'https://www.youtube.com/watch?v=AB9VToh2y-s', 
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 60, 'Activo', TRUE, 'Activo', 5, 8, 'Ana Fernández', '77000004'),

('Robótica Educativa', 
 'Proyecto orientado a la enseñanza de robótica en escuelas, fomentando la educación STEM desde edades tempranas. Incluye desarrollo de kits de robótica, talleres prácticos y competencias entre estudiantes. Se busca estimular el pensamiento lógico, la creatividad y la colaboración, preparando a los niños para los desafíos del siglo XXI y promoviendo habilidades tecnológicas esenciales.', 
 'Robots educativos para niños.', 
 '/uploads/proyecto5.png', 
 'https://www.youtube.com/watch?v=Ffz4VGqRww4', 
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 90, 'Activo', TRUE, 'Activo', 6, 11, 'Luis Ramírez', '77000005');

-- ------------------------------------------------------
-- Imágenes adicionales por proyecto
-- ------------------------------------------------------
INSERT INTO Proyecto_Imagen (IdProyecto, UrlImagen)
VALUES
(1, '/uploads/proyecto1_extra1.png'),
(1, '/uploads/proyecto1_extra2.png'),
(2, '/uploads/proyecto2_extra1.png'),
(3, '/uploads/proyecto3_extra1.png'),
(4, '/uploads/proyecto4_extra1.png'),
(5, '/uploads/proyecto5_extra1.png');

-- ------------------------------------------------------
-- Documentos por proyecto
-- ------------------------------------------------------
INSERT INTO Proyecto_Documento (IdProyecto, NombreDocumento, UrlDocumento, TipoDocumento)
VALUES
(1, 'Plan de desarrollo', '/uploads/doc1.pdf', 'PDF'),
(2, 'Guía educativa', '/uploads/doc2.pdf', 'PDF'),
(3, 'Informe de biotecnología', '/uploads/doc3.pdf', 'PDF'),
(4, 'Catálogo interactivo', '/uploads/doc4.pdf', 'PDF'),
(5, 'Manual de robótica', '/uploads/doc5.pdf', 'PDF');

-- ------------------------------------------------------
-- Asesorías seleccionadas por proyecto
-- ------------------------------------------------------
INSERT INTO Proyecto_Asesoria (IdProyecto, IdAsesoria, Completada)
VALUES
(1, 1, FALSE), (1, 8, FALSE),
(2, 3, FALSE), (2, 8, FALSE),
(3, 1, FALSE), (3, 6, FALSE),
(4, 8, FALSE), (4, 13, FALSE),
(5, 11, FALSE), (5, 8, FALSE);

-- ------------------------------------------------------
-- Redes sociales por proyecto
-- ------------------------------------------------------
INSERT INTO Proyecto_RedSocial (IdProyecto, Url)
VALUES
(1, 'https://www.facebook.com/'),
(1, 'https://x.com/'),
(2, 'https://www.facebook.com/'),
(2, 'https://youtube.com/'),
(3, 'https://www.instagram.com/'),
(3, 'https://x.com/'),
(4, 'https://www.facebook.com/'),
(4, 'https://instagram.com/'),
(5, 'https://www.facebook.com/'),
(5, 'https://x.com/');
