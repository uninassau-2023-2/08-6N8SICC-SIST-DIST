# Alunos

* Alexandre Augusto Silva da Rocha - 01362296
* Thiago Alexandre Cordeiro Vasconcelos  - 01288929
* Matheus Henrique Carneiro da Nóbrega - 01370499


## Projeto de Senhas de atedimento
  Construção de uma API do zero com base no escopo do projeto da cadeira de Sitemas Distrubidos, onde consiste em um sistema de atendimento por Senhas
### Instruções para Configuração do Ambiente:
#### **Requisitos:**
NodeJS;
Express;
nodemon;
Dockers;
MySQL 8.0;

1. **Instalação do Docker:**
   
   Siga as instruções no [site oficial do Docker](https://docs.docker.com/desktop/install/windows-install/) para instalar o Docker em seu sistema.

2. **Criar a Imagem e o Banco de Dados no Docker:**

   - Criar um contêiner MySQL com uma senha e um banco de dados personalizados:
   ```PowerShell
   docker run -d -p 3306:3306 --name db_sd -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=db_sd mysql:8.0
   ```
   ```PowerShell
   docker exec -it db_sd /bin/bash
   mysql -v
   mysql -u root -p -A
   SELECT user, host FROM mysql.user;
   UPDATE mysql.user SET host='%' WHERE user='root';
   FLUSH PRIVILEGES;
   ```

3. **Configuração do arquivo `.env`:**

   ```
  
   PORT=3333
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=root
   MYSQL_DB=atendimento
   ```

4. **Abrir o Visual Studio Code:**

   Abra o Visual Studio Code para começar a trabalhar no backend do seu projeto.

5. **Criar a Estrutura do Backend:**

   Crie uma pasta para o backend do seu projeto no Visual Studio Code:
   ```bash
   mkdir backend
   ```

6. **Instalar as Dependências:**

   Certifique-se de que o Node.js e o npm estão instalados. Para verificar, execute:

   ```bash
   node -v
   npm -v
   ```

   Se não estiverem instalados, visite [nodejs.org](https://nodejs.org/) para baixar e instalar o Node.js, que inclui o npm.

   No terminal do Visual Studio Code, navegue até a pasta do backend e execute os seguintes comandos:

   ```bash
   npm install nodemon -D
   npm install dotenv
   npm install express
   npm install mysql2
   ```

7. **Montando o Banco de Dados:**

   Para configurar o banco de dados para o sistema de controle de atendimento em laboratórios médicos, execute os seguintes comandos SQL:

   ```sql
   -- Cria o banco de dados 'atendimento'
   CREATE DATABASE atendimento;

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
       data_atendimento TIMESTAMP CURRENT_TIMESTAMP
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

   INSERT INTO Agentes (guiche, nome_agente) VALUES (01, 'Jasé Chitsu');

   SET time_zone = 'America/Sao_Paulo';   
   ```

--- 


## Escopo do Projeto( Sistema para Controle de Atendimento)

Sistemas de **"tickets"** são ferramentas para apoio à gestão do atendimento ao usuário. Também são conhecidos como sistemas de **"chamados"**, quando tratando do atendimento de demandas no setor de TI. Essas ferramentas trabalham fornecendo um controle através do registro na fila de atendimento que, por vezes, obedece a esquemas de priorização. Este documento, elaborado após entrevista conduzida pelo Analista de Negócios e um suposto cliente, tem por objetivo apresentar os requisitos iniciais para um sistema de gestão de tickets de serviço, relatado sob a visão adaptada desse suposto cliente.

Em se tratando de nosso projeto de disciplina, vamos desenvolver a documentação para um sistema de controle do atendimento em filas de laboratórios médicos. Tal sistema (solução) irá trabalhar com **3 agentes**, cada um com seu papel específico no processo:

- **AS – Agente Sistema**, emite as senhas e responde aos comandos da atendente.
- **AA – Agente Atendente**, responsável por acionar o sistema para chamar o próximo na fila e efetuar o seu atendimento ao cliente em seu guichê.
- **AC – Agente Cliente**, interessado no atendimento, aciona um totem para emitir seu número de senha e aguarda o número ser chamado no painel, onde também é informado para qual guichê se dirigir.

Ambos agentes concorrem pela boa execução do **Serviço de Atendimento (SA)**. Como característica da fila, haverá **3 tipos de senhas** definidos de acordo com a priorização do atendimento:

- **SP** - Senha Prioritária.
- **SG** - Senha Geral.
- **SE** - Senha para retirada de Exames.

O atendimento possui um tempo de retenção do cliente no guichê, sendo calculado pela média do tempo despendido no atendimento ao cliente para cada tipo de senha. O tempo de retenção é chamado de:

- **TM – Tempo Médio de Atendimento**, exclusivamente para as senhas SP e SG, sendo de **5 minutos para a SG** e de **15 minutos para a senha SP**.

A senha prioritária (SP), como o próprio nome diz, tem maior prioridade no atendimento, sendo chamada para o próximo guichê que estiver disponível. Seu TM pode variar aleatoriamente 5 minutos para baixo ou para cima, em igual distribuição.

A senha para retirada de exames (SE) não possui prioridade, entretanto, pelo tipo de atendimento ser muito rápido, seu tempo médio de atendimento (TM) é inferior a 1 minuto. A priorização será ignorada, e a senha será chamada para o próximo guichê que estiver disponível, após o atendimento de uma senha SP. Seu TM pode variar entre 1 minuto para 95% dos SA e 5 minutos para 5% dos SA.

Já a senha geral (SG), por consequência, terá a menor prioridade de atendimento, sendo chamada para atendimento assim que houver um guichê disponível após finalização do atendimento para as senhas SP e SE, caso disponíveis. Seu TM varia em igual proporção 3 minutos para baixo ou para cima.

Há de se ressaltar que a cada novo serviço de atendimento (SA) deverá ser chamada uma nova senha de prioridade diferente daquela chamada anteriormente, de acordo com o diagrama abaixo:

\[SP\] -> \[SE|SG\] -> \[SP\] -> \[SE|SG\]

Neste modelo, não importando quantas senhas SG estejam na fila, sempre serão atendidas, por ordem, uma senha SP, caso exista na fila, em seguida uma senha SE, caso também exista na fila, para enfim, ser atendida uma senha SG, até que todas as filas sejam encerradas ou o expediente encerre.

O sistema deverá tratar o início do expediente de trabalho, para a chamada das senhas, começando às **7 horas da manhã** e o final do expediente de trabalho, encerrando às **17 horas**. Caso sobrem senhas, estas deverão ser descartadas.

No painel de chamados, deverá constar a informação das **5 últimas senhas chamadas**. Não poderá constar a próxima senha, pois entre a finalização de um SA e o acionamento do painel pelo AA, poderá ser emitida uma nova senha que mudará a sequência de atendimentos.

Não haverá guichês para atendimento específico; qualquer guichê poderá atender qualquer tipo de senha. De modo geral, **5%** de todas as senhas de atendimento emitidas não são atendidas, por motivos diversos, sob responsabilidade do AC. Estas deverão ser descartadas sem que seja executado o SA.

Cada senha deverá apresentar uma numeração que siga o modelo **YYMMDD-PPSQ**, onde:

- **YY** – Ano da emissão, com dois dígitos.
- **MM** – Mês do ano da emissão, com dois dígitos.
- **DD** – Dia do mês da emissão, com dois dígitos.
- **PP** – Tipo da senha com dois caracteres.
- **SQ** – Sequência da senha por prioridade, reinício diário.

O cliente também pede que seja emitido um **relatório diário e mensal**, contendo:

- Quantitativo geral das senhas emitidas.
- Quantitativo geral das senhas atendidas.
- Quantitativo das senhas emitidas, por prioridade.
- Quantitativo das senhas atendidas, por prioridade.
- Relatório detalhado das senhas contendo, numeração, tipo de senha, data e hora da emissão e data e hora do atendimento, guichê responsável pelo SA. Caso não tenha sido atendida, estes últimos campos ficarão em branco.
- Relatório do TM, que devido à variação aleatória no atendimento, poderá mudar.

O cliente relata que em sua infraestrutura de TI já há suporte para as tecnologias de Banco de dados MySQL em sua versão **8.0**, backend desenvolvido em **NodeJS** e frontend desenvolvido com **React**, **Angular** ou **Vue**. Entretanto, caso haja outra proposta de infraestrutura, esta poderá ser analisada desde que bem explicado como deverá ser construída


