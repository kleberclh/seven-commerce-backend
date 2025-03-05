# Seven-Commerce  (v2.0.0)

Bem-vindo à **Seven-Commerce**, um sistema backend desenvolvido para gerenciar cadastros, estoque, pedidos e pagamentos de uma loja virtual.

## 🚀 Desenvolvido por @kleberclh

---

## 📌 Funcionalidades

- ✅ Cadastro de produtos
- ✅ Cadastro de usuários
- ✅ Controle de estoque
- ✅ Checkout
- ✅ Listagem de pedidos
- ✅ Listagem de clientes
- ✅ Dashboard administrativo

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** (Ambiente de execução JavaScript)
- **Express.js** (Framework para criação da API)
- **Prisma ORM** (Gerenciamento do banco de dados)
- **MySQL** (Banco de dados relacional)
- **JWT** (Autenticação segura de usuários)
- **Stripe** (Integração com pagamentos)

---

## 📦 Instalação e Configuração

1. **Clone o repositório**
   ```sh
   git clone https://github.com/seven-pk/seven-commerce-backend.git
   cd seven-commerce-backend
   ```

2. **Instale as dependências**
   ```sh
   npm install
   ```

3. **Configuração do Banco de Dados**
   - Crie um arquivo `.env` na raiz do projeto e adicione:
     ```env
     DATABASE_URL="mysql://usuario:senha@localhost:3306/seven_commerce"
     SECRET="sua_chave_secreta"
     STRIPE_SECRET_KEY="sua_chave_stripe"
     ```

4. **Execute as migrações do banco**
   ```sh
   npx prisma migrate dev
   ```

5. **Inicie o servidor**
   ```sh
   npm start
   ```

---

## 📡 Rotas da API

### 🔐 Autenticação
- **POST** `/login` - Cadastro de usuário
- **POST** `/registrar` - Login e geração de token JWT
- **GET** `/me` - Rota autenticada que retorna as informações do usuário, incluindo se é Admin e os dados básicos do cadastro.

### 📦 Produtos
- **GET** `/produtos` - Listar produtos
- **POST** `/produto` - Criar produto
- **PUT** `/produto/:uuid` - Atualizar produto
- **DELETE** `/produto/:uuid` - Remover produto

### 🛒 Pedidos
- **GET** `/order` - Listar pedidos
- **POST** `/order` - Criar um pedido

### 🛍️ Checkout
- **POST** `/checkout` - Pagamento via Stripe
- **POST** `/webhook` - Para recebimento do evento Webhook

---


## 📝 Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usá-lo e modificá-lo conforme necessário.

---

💡 **Desenvolvido por @kleberclh**

