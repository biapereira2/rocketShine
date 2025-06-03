# 🚀 RocketShine API

API para gerenciamento de uma loja de joias, construída com **NestJS**, **Prisma** e **SQLite**.  
Permite operações de criação, atualização, listagem e remoção de produtos, além de funcionalidades de carrinho de compras e favoritos.

---

## Tecnologias

- **NestJS** — Framework Node.js para construir aplicações escaláveis.
- **TypeScript** — Superset do JavaScript para tipagem estática.
- **Prisma ORM** — Mapeamento objeto-relacional para facilitar acesso ao banco.
- **SQLite** — Banco de dados leve e simples para desenvolvimento.
- **Jest** — Framework de testes para garantir qualidade do código.
- **pnpm** - Gerenciamento de pacotes
- **Swagger** - Documentação interativa das rotas

---

## Funcionalidades

- CRUD completo dos produtos
- Gerenciamento de carrinho de compras: adicionar, atualizar, remover itens, finalizar pedido
- Favoritos: favoritar e desfavoritar produtos, listar favoritos
- Histórico de pedidos finalizados
- Endpoints REST organizados com padrões claros

---

## Instalação

1. Clone o repositório

```bash
git clone https://github.com/biapereira2/rocketShine.git
cd rocket-shine

```

2. Instale as dependências

```bash
pnpm install
```

3. Crie um arquivo .env na raiz do projeto com o conteúdo abaixo para configurar o banco SQLite

```bash
DATABASE_URL="file:./dev.db"
```

4. Rode as migrations

```bash
npx prisma migrate dev
```

5. Popule o banco com os dados iniciais

```bash
npx prisma db seed
```

6. Inicie a aplicação

```bash
nest start --watch
```

## Para executar os testes unitários:

1.  Rode o comando

```bash
pnpm test --verbose
```

2. Para verificar a cobertura dos testes

```bash
pnpm run test:cov
```
