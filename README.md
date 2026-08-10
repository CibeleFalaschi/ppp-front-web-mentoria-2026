# Gestão de Clientes

Projeto desenvolvido durante a Mentoria de Testes de Software 2.0, ministrada por Júlio de Lima, como projeto de portfólio pessoal para prática de testes de software.

## Tecnologias

Node.js, Express, HTML, CSS, JavaScript, Bulma via CDN, Cypress, Swagger e GitHub Actions.

## Objetivo

O projeto consiste em uma aplicação web para gestão de clientes, utilizada como base para a prática de testes de software.

A aplicação possui autenticação de usuários, dashboard, cadastro e gerenciamento de clientes e usuários, além de filtros e consultas.

A aplicação web consome uma API REST documentada em Swagger.

## Funcionalidades

A aplicação possui:

- Login de usuário;
- Dashboard com métricas de clientes;
- Cadastro de clientes;
- Consulta de cliente;
- Listagem de cliente;
- Edição de clientes;
- Exclusão de clientes;
- Pesquisa por nome, e-mail, telefone e status;
- Gerenciamento de usuários.

## Issues e Wiki

Foi realizado teste exploratório e os resultados foram registrados nas Issues e na Wiki.

- As Issues do GitHub foram utilizadas para registrar os bugs encontrados.
- A Wiki foi utilizada para registrar os testes realizados e sugestões de melhoria.

## Testes automatizados

Foram criados testes automatizados utilizando Cypress.

Os testes desenvolvidos contemplam:

- Login;
- Cadastro de cliente com dados válidos.

Os dados utilizados no teste de cadastro são armazenados em uma fixture (`cliente.json`), permitindo reutilizar os dados durante a execução dos testes.

> **Observação:** os dados de teste utilizados são fixos. Em execuções repetidas contra o mesmo banco, isso pode gerar conflito de dados duplicados (erro 409). Uma melhoria futura seria gerar dados dinâmicos (ex: com timestamp) ou resetar a base antes da execução.

Os testes podem ser executados pelo terminal com:

    npm test

Também é possível abrir a interface do Cypress com:

    npm run cy:open

## CI – Integração Contínua

O projeto utiliza GitHub Actions para executar os testes automatizados do Cypress.

A pipeline é acionada a cada push ou pull request na branch `main`. Durante a execução, o GitHub prepara o ambiente, faz o checkout deste repositório e do repositório da API (`ppp-mentoria-2026`), instala as dependências de ambos os projetos, inicia a API e a aplicação web, e então executa os testes automatizados.

## Como executar o projeto

É necessário ter o Node.js instalado.

Na pasta do projeto, execute:

    npm install

Depois, inicie a aplicação:

    npm start

A aplicação web estará disponível em: `http://localhost:4000`

A API utilizada pela aplicação roda em: `http://localhost:3000`

A documentação da API pode ser acessada pelo Swagger: `http://localhost:3000/docs`

## Login para teste

Usuário: `admin`
Senha: `admin123`

## Estrutura principal do projeto

    .
    ├── .github/
    │   └── workflows/
    │       └── ci.yml
    ├── cypress/
    │   ├── e2e/
    │   │   ├── cliente.cy.js
    │   │   └── login.cy.js
    │   ├── fixtures/
    │   │   └── cliente.json
    │   └── support/
    ├── public/
    │   ├── app.js
    │   ├── index.html
    │   └── styles.css
    ├── resources/
    │   └── swagger.json
    ├── cypress.config.js
    ├── package.json
    ├── package-lock.json
    └── server.js
