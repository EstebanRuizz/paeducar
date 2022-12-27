CREATE DATABASE database_paeducar;
USE database_paeducar;

CREATE TABLE usuario
(
id_usuario BIGINT NOT NULL,
correo_usuario VARCHAR(200) NOT NULL,
nombres VARCHAR(200) NOT NULL,
apellidos VARCHAR(200),
telefono VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp,
PRIMARY KEY(id_usuario)
)
ENGINE=INNODB;

CREATE TABLE publicacion
(
id_publicacion INT NOT NULL AUTO_INCREMENT,
titulo_publicacion VARCHAR(100) NOT NULL,
tipo_publicacion VARCHAR(100) NOT NULL,
link_form_publicacion VARCHAR(500),
descripcion VARCHAR(1000) NOT NULL,
imagen LONGTEXT,
created_at timestamp NOT NULL DEFAULT current_timestamp,
PRIMARY KEY (id_publicacion)
);

CREATE TABLE alianza
(
id_alianza INT NOT NULL AUTO_INCREMENT,
nombre_alianza VARCHAR(100) NOT NULL,
tipo_alianza VARCHAR(100) NOT NULL,
imagen_alianza MEDIUMBLOB NOT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp,
PRIMARY KEY(id_alianza)
);

CREATE TABLE periodico
(
id_periodico INT NOT NULL AUTO_INCREMENT,
editorial_periodico VARCHAR(100) NOT NULL,
nombre_periodico VARCHAR(100) NOT NULL,
periodico LONGTEXT NOT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp,
PRIMARY KEY(id_periodico)
);

CREATE TABLE reserva
(
id_reserva INT NOT NULL AUTO_INCREMENT,
id_ambiente INT NOT NULL,
id_usuario BIGINT NOT NULL,
telefono VARCHAR(100) NOT NULL,
descripcion VARCHAR(500) NOT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp,
PRIMARY KEY(id_reserva),
CONSTRAINT usuario_reserva FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE inscripcion
(
id_inscripcion INT NOT NULL AUTO_INCREMENT,
id_publicacion INT NOT NULL,
id_usuario BIGINT NOT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp,
PRIMARY KEY(id_inscripcion),
CONSTRAINT id_publicacion_inscripcion FOREIGN KEY(id_publicacion) REFERENCES publicacion(id_publicacion),
CONSTRAINT id_usuario_inscripcion FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario)
);


CREATE TABLE administrador
(
administrador_id BIGINT NOT NULL,
administrador_correo VARCHAR(200) NOT NULL,
administrador_nombres VARCHAR(200) NOT NULL,
administrador_apellidos VARCHAR(200),
administrador_telefono VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp,
PRIMARY KEY(administrador_id)
)

