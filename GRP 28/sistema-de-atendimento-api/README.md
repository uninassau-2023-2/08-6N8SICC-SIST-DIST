# Subir imagem do MySQL com Docker

docker-compose up -

# String de conexão da maneira correta para ter acesso ao banco

jdbc:mysql://localhost:3306/projeto-1?allowPublicKeyRetrieval=true&useSSL=false

# Adicionar as tabelas ao banco de dados

npx prisma db push

# Criar o prisma client com os dados da tabela

npx prisma generate

# Rodar o projeto em modo de desenvolvimento

npm rum dev
