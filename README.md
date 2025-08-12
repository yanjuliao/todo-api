# TODO API (NestJS)

API REST simples e bem estruturada para gerenciar **Tarefas (Todos)** e **Categorias** usando NestJS. O projeto destaca arquitetura limpa (Controller → Service → Repository), contratos via DTO, validação e documentação com Swagger.

## Sumário
- [Recursos](#recursos)
- [Stack](#stack)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Rodar](#como-rodar)
- [Documentação da API](#documentação-da-api)
- [Regras de Domínio](#regras-de-domínio)
- [Referência da API](#referência-da-api)
  - [Categories](#categories)
  - [Todos](#todos)
- [Códigos de Erro](#códigos-de-erro)
- [Boas Práticas e Decisões](#boas-práticas-e-decisões)
- [Melhorias Futuras](#melhorias-futuras)

---

## Recursos
- CRUD para **Categories** e **Todos**
- Cada **Todo** pertence a exatamente **uma Category**
- Enum de status do Todo: `PENDING` | `DONE`
- Validação de entrada com **class-validator**
- Serialização de saída com **class-transformer** + **ClassSerializerInterceptor**
- **Response DTOs + mappers** (nenhuma Entity do ORM vaza na resposta)
- Filtros: `GET /todos?status=&categoryId=`
- Banco local **SQLite** via TypeORM (zero configuração)
- Swagger com exemplos

## Stack
- **NestJS** (Controllers, Providers, Modules, DI)
- **TypeORM** + **SQLite**
- **class-validator** & **class-transformer**
- **Swagger** (OpenAPI) via `@nestjs/swagger`

## Estrutura do Projeto
```
src/
  app.module.ts
  main.ts
  auth/
    application/
      dto/
        login.dto.ts
      auth.controller.ts
      auth.module.ts
      auth.service.ts
      bearer-token.guard.ts
      bearer-token.guard.ts
      jwt-auth.guard.ts
      public.decorator.ts
      roles.decorator.ts
      roles.guard.ts
    infraestructure/
      jwt.strategy.ts
  common/
    to-dto.ts
  categories/
    application/
      categories.controller.ts
      category.mapper.ts
      dto/
        requests/create-category.dto.ts
        response/category-summary.dto.ts
        response/category.response.dto.ts
    domain/  
      categories.service.ts
      constants/messages.ts
    infraestructure/
      category.entity.ts
      categories.repository.ts
    categories.module.ts
  todos/
    application/
      todos.controller.ts
      todo.mapper.ts
      dto/
        requests/create-todo.dto.ts
        requests/update-todo.dto.ts
        requests/filter-todo.query.dto.ts
        response/todo.response.dto.ts
    domain/
      todos.service.ts
      constants/messages.ts
      enums/todo-status.enum.ts
    infraestructure/
      todo.entity.ts
      todos.repository.ts
    todos.module.ts
  users/
    application/
      users.controller.ts
      user.mapper.ts
      dto/
        requests/create-user.dto.ts
        requests/update-user.dto.ts
        response/user.response.dto.ts
    domain/
      users.service.ts
      constants/messages.ts
      enums/role.enum.ts
    infraestructure/
      user.entity.ts
      users.repository.ts
    users.module.ts
  
```

## Como Rodar
### Pré-requisitos
- Node.js **18+** e npm
- Nest CLI (opcional): `npm i -g @nestjs/cli`

### Instalação
```bash
npm install
```

### Banco de Dados
O arquivo SQLite é criado automaticamente na raiz do projeto (`db.sqlite`). Nenhuma configuração extra é necessária.

### Execução
```bash
# desenvolvimento (watch)
npm run start:dev

```
- Servidor: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`

## Documentação da API
A API é totalmente documentada no Swagger. Os DTOs possuem exemplos; as respostas são serializadas via **ClassSerializerInterceptor**, expondo apenas campos anotados com `@Expose()` nos Response DTOs.

## Regras de Domínio
- Todo **Todo** deve ter uma **Category** (`categoryId` é obrigatório).
- **Excluir Category** só é permitido quando **não há Todos** vinculados. Caso exista vínculo, retorna **400 Bad Request** com o código `category_has_related_todos`.

## Referência da API

### Categories
#### Criar Categoria
```
POST /categories
Content-Type: application/json
```
Exemplo de body:
```json
{
  "name": "Groceries",
  "description": "Tasks related to grocery shopping and supplies."
}
```
**201 Created** — Exemplo de resposta:
```json
{
  "id": 1,
  "name": "Groceries",
  "description": "Tasks related to grocery shopping and supplies.",
  "createdAt": "2025-08-11T14:35:00.000Z",
  "updatedAt": "2025-08-11T14:35:00.000Z"
}
```

#### Listar Categorias
```
GET /categories
```
**200 OK** — Exemplo:
```json
[
  {
    "id": 1,
    "name": "Groceries",
    "description": "Tasks related to grocery shopping and supplies.",
    "createdAt": "2025-08-11T14:35:00.000Z",
    "updatedAt": "2025-08-11T14:35:00.000Z"
  }
]
```

#### Obter Categoria por ID
```
GET /categories/{id}
```
**200 OK** — Mesmo formato do **Create**.

#### Atualizar Categoria
```
PUT /categories/{id}
Content-Type: application/json
```
Exemplo de body:
```json
{
  "name": "Home & Groceries",
  "description": "Household shopping tasks."
}
```
**200 OK** — Retorna a categoria atualizada.

#### Excluir Categoria
```
DELETE /categories/{id}
```
- **204 No Content** em caso de sucesso
- **400 Bad Request** com `category_has_related_todos` se houver Todos vinculados
- **404 Not Found** se a categoria não existir

---

### Todos
#### Criar Todo
```
POST /todos
Content-Type: application/json
```
Exemplo de body:
```json
{
  "title": "Buy milk",
  "description": "Buy skimmed milk at the grocery store.",
  "status": "PENDING",
  "categoryId": 1
}
```
**201 Created** — Exemplo de resposta:
```json
{
  "id": 42,
  "title": "Buy milk",
  "description": "Buy skimmed milk at the grocery store.",
  "status": "PENDING",
  "categoryId": 1,
  "category": { "id": 1, "name": "Groceries" },
  "createdAt": "2025-08-11T14:35:00.000Z",
  "updatedAt": "2025-08-11T14:35:00.000Z"
}
```

#### Listar Todos (com filtros)
```
GET /todos
```
Query params:
- `status` = `PENDING` | `DONE`
- `categoryId` = number

Exemplo:
```
GET /todos?status=PENDING&categoryId=1
```
**200 OK** — Exemplo:
```json
[
  {
    "id": 42,
    "title": "Buy milk",
    "description": "Buy skimmed milk at the grocery store.",
    "status": "PENDING",
    "categoryId": 1,
    "category": { "id": 1, "name": "Groceries" },
    "createdAt": "2025-08-11T14:35:00.000Z",
    "updatedAt": "2025-08-11T14:35:00.000Z"
  }
]
```

#### Obter Todo por ID
```
GET /todos/{id}
```
**200 OK** — Mesmo formato do **Create Todo**.

#### Atualizar Todo
```
PUT /todos/{id}
Content-Type: application/json
```
Exemplo de body (parcial):
```json
{
  "title": "Buy milk and bread",
  "status": "DONE"
}
```
**200 OK** — Retorna o todo atualizado.

#### Excluir Todo
```
DELETE /todos/{id}
```
- **204 No Content** em caso de sucesso
- **404 Not Found** se o todo não existir

---

### Users
#### Criar User
```
POST /users
Content-Type: application/json
```
Exemplo de body:
```json
{
  "name": "Edmilson",
  "email": "edmilson@example.com",
  "password": "teste123",
  "role": "USER"
}
```
**201 Created** — Exemplo de resposta:
```json
{
  "id": 10,
  "name": "Edmilson",
  "email": "edmilson@example.com",
  "role": "USER",
  "createdAt": "2025-08-11T14:35:00.000Z",
  "updatedAt": "2025-08-11T14:40:00.000Z"
}
```

#### Listar Todos (com filtros)
```
GET /users
```


Exemplo:
```
GET /users
```
**200 OK** — Exemplo:
```json
[
  {
    "id": 10,
    "name": "Edmilson",
    "email": "edmilson@example.com",
    "role": "USER",
    "createdAt": "2025-08-11T14:35:00.000Z",
    "updatedAt": "2025-08-11T14:40:00.000Z"
  }
]
```

#### Obter Todo por ID
```
GET /users/{id}
```
**200 OK** — Mesmo formato do **Create User**.

#### Atualizar Todo
```
PUT /users/{id}
Content-Type: application/json
```
Exemplo de body:
```json
{
  "name": "Edmilson",
  "email": "edmilsonShow@example.com",
  "password": "teste124",
  "role": "USER"
}
```
**200 OK** — Retorna o user atualizado.

#### Excluir Todo
```
DELETE /todos/{id}
```
- **204 No Content** em caso de sucesso
- **404 Not Found** se o todo não existir

---

## Códigos de Erro
A API retorna códigos/mensagens padronizados:
- `category_not_found`
- `todo_not_found`
- `category_has_related_todos`
- `category_name_already_exists`
- `Validation error` (erros de validação dos DTOs)

## Boas Práticas e Decisões
- **Contract-first**: Response DTOs com `@Expose()` evitam vazar Entities.
- **Serialização**: `ClassSerializerInterceptor` habilitado globalmente com `excludeExtraneousValues`.
- **Validação**: `ValidationPipe` global com `whitelist`, `forbidNonWhitelisted`, `transform`.
- **Repositories**: encapsulam TypeORM e centralizam queries (joins, filtros).
- **Mappers**: funções puras para converter Entities ⇄ DTOs; mappers de request fazem `trim` e defaults.
- **Mensagens**: centralizadas por módulo (`CATEGORY_MESSAGES`, `TODO_MESSAGES`).
- **DB**: `synchronize: true` para o desafio; em produção usar **migrations** e `synchronize: false`.

## Autenticação JWT
- Toda vez que o projeto roda, a main tenta criar o usuario admin a partir dos dados do env conforme .env_example, se não existir o admin no banco ele cria.
- Após isso é só logar com usuário e senha admin do env. A rota de login é publica e todas as outras são protegidas por token.
- As únicas diferenças de role admin e user é que o user não consegue excluir um usuário e também não consegue criar um usuário admin, somente admin pode criar um usuário admin.
