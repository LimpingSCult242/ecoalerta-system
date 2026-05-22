use pontelli93b45689_italo03db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cidade VARCHAR(100),
    role ENUM('user', 'vice-lider', 'admin') DEFAULT 'user',
    foto_perfil VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    protocolo VARCHAR(20) UNIQUE NOT NULL,

    titulo VARCHAR(150) NOT NULL,

    categoria VARCHAR(100) NOT NULL,

    gravidade ENUM('Baixa', 'Media', 'Alta', 'Urgente') NOT NULL,

    descricao TEXT NOT NULL,

    cidade VARCHAR(100) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    rua VARCHAR(150),
    cep VARCHAR(10),

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    data_ocorrencia DATE,
    hora_ocorrencia TIME,

    imagem VARCHAR(255),

    status ENUM(
        'Aberto',
        'Em andamento',
        'Concluido',
        'Cancelado'
    ) DEFAULT 'Aberto',

    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

CREATE TABLE historico_reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    reporte_id INT NOT NULL,
    usuario_id INT,

    acao VARCHAR(100) NOT NULL,

    descricao TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reporte_id)
    REFERENCES reportes(id)
    ON DELETE CASCADE,

    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE SET NULL
);

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,

    reporte_id INT NOT NULL,
    usuario_id INT NOT NULL,

    comentario TEXT NOT NULL,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reporte_id)
    REFERENCES reportes(id)
    ON DELETE CASCADE,

    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

USE pontelli93b45689_italo03db;


ALTER TABLE reportes
ADD usuario_nome VARCHAR(100);

ALTER TABLE reportes
ADD coordenadas VARCHAR(100);

ALTER TABLE reportes
ADD anonimo BOOLEAN DEFAULT FALSE;

ALTER TABLE reportes
ADD atualizado_em TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP;


ALTER TABLE reportes
MODIFY status ENUM(
    'Pendente',
    'Em andamento',
    'Resolvido',
    'Cancelado'
) DEFAULT 'Pendente';


CREATE TABLE notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    titulo VARCHAR(150),

    mensagem TEXT,

    lida BOOLEAN DEFAULT FALSE,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);


CREATE INDEX idx_usuario
ON reportes(usuario_id);

CREATE INDEX idx_status
ON reportes(status);

CREATE INDEX idx_categoria
ON reportes(categoria);