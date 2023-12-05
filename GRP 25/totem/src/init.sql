-- Active: 1696614595907@@127.0.0.1@3306@atendimento
-- Cria o banco de dados 'atendimento'
CREATE DATABASE  IF NOT EXISTS atendimento;

-- Usar o banco de dados 'atendimento'
USE atendimento;

-- Cria a tabela 'Agentes'
CREATE TABLE Agentes (
    id_agente INT AUTO_INCREMENT PRIMARY KEY,
    guiche ENUM('01', '02'),
    nome_agente VARCHAR(50)
);

-- Cria a tabela 'FilaTemp'
CREATE TABLE FilaTemp (
    prioridade ENUM('SP', 'SE', 'SG'),
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ordem INT
);

-- Cria a tabela 'DataTemp'
CREATE TABLE DataTemp (
    data_atendimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DisplayTemp (
    id_dpstemp INT AUTO_INCREMENT PRIMARY KEY,
    prioridade ENUM('SP', 'SE', 'SG'),
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ordem INT,
    guiche INT
);

-- Cria a tabela 'Senhas'
CREATE TABLE Senhas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prioridade ENUM('SP', 'SE', 'SG'),
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guiche INT,
    ordem INT,
    atendido TINYINT DEFAULT 0,
    data_atendimento TIMESTAMP,
    tempo_atendimento TIMESTAMP

);

insert INTO Agentes (guiche,nome_agente) values(01,'Jasé Chitsu');

SET time_zone = 'America/Sao_Paulo';
* Lucas Gabriel Melo da Silva - 01389830
* Thiago Alexandre Cordeiro Vasconcelos  - 01288929