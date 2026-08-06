# Gestão de Clientes

Aplicação web de demonstração para gestão de clientes com autenticação JWT, painel administrativo e consumo de endpoints documentados no Swagger.

## Objetivo

Este projeto foi desenvolvido como prática de portfólio para demonstrar:

- fluxo de autenticação com JWT;
- painel administrativo com dashboard;
- listagem, cadastro, consulta, edição e exclusão de clientes;
- integração com uma API REST documentada em Swagger;
- uso de uma arquitetura web simples com Express e HTML/CSS/JS.

## Tecnologias

- Node.js
- Express
- HTML
- CSS
- JavaScript
- Bulma

## Requisitos

- Node.js instalado
- API REST disponível em `http://localhost:3000`
- Browser para acessar a aplicação web

## Como executar

1. Abra o terminal na pasta do projeto.
2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor web:

```bash
npm start
```

4. Acesse no navegador:

```text
http://localhost:4000
```

## Login de exemplo

A API documentada no Swagger apresenta o seguinte exemplo de autenticação:

- usuário: `admin`
- senha: `admin123`

## Funcionalidades

- Login de usuário
- Dashboard com métricas resumidas
- Listagem de clientes
- Cadastro de clientes
- Consulta de cliente por ID
- Edição de clientes
- Exclusão de clientes
- Pesquisa por nome, email, telefone e status
- Gestão de usuários conforme o contrato da API

## Fluxo de autenticação

- O login é realizado no front para obter um token JWT.
- O token é persistido no navegador e enviado em requisições autenticadas.
- O front consome apenas os endpoints documentados no Swagger.

## Estrutura do projeto

```text
.
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── resources/
│   └── swagger.json
├── server.js
└── package.json
```

## Observações

- A aplicação web roda na porta `4000`.
- A API base utilizada pelo proxy está em `http://localhost:3000`.
- O front não deve implementar rotas ou recursos que não existam no Swagger.

## Próximos passos

- validar o contrato do backend com a API real;
- expandir a documentação de usuários e permissões;
- adicionar melhorias de UX e tratamento de erros.
