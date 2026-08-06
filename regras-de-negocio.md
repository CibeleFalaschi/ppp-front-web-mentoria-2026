# Regras de negócio

## 1. Autenticação

- O acesso ao sistema é realizado por meio de login com usuário e senha.
- O login retorna um token JWT.
- O token deve ser enviado em todas as rotas protegidas.
- Se o token estiver ausente ou inválido, a aplicação deve exigir novo login.

## 2. Perfis de acesso

- `admin` é o perfil administrativo principal.
- `vendedor` é o perfil operacional de uso do sistema.

## 3. Gestão de usuários

- O cadastro, edição e exclusão de usuários deve seguir o contrato documentado da API.
- A criação de novos usuários é uma ação administrativa.
- O perfil `admin` é o principal responsável por gerenciar usuários.

## 4. Gestão de clientes

- Usuários autenticados podem consultar, cadastrar, editar e excluir clientes.
- A pesquisa deve permitir filtros por:
  - nome;
  - e-mail;
  - telefone;
  - status.
- Os status previstos para clientes são:
  - `Aberto`
  - `Fechado`
  - `Perdido`

## 5. Dashboard

- O dashboard deve apresentar indicadores resumidos de clientes.
- O sistema deve expor contadores gerais para facilitar análise rápida.

## 6. Integridade do contrato

- O front-end deve consumir apenas os endpoints e estruturas documentados no Swagger.
- Não devem ser criados endpoints inventados no front.
- Qualquer evolução da interface precisa seguir o contrato da API.

## 7. Premissas do projeto

- A aplicação tem foco em portfólio e prática de testes.
- A funcionalidade deve ser simples, clara e fiel ao contrato da API.
- A documentação deve facilitar a execução local, a compreensão e a avaliação do projeto.
