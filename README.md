# Seven-Commerce API (v2.0.0)

Bem-vindo à **Seven-Commerce API**, um sistema backend desenvolvido para gerenciar cadastros, estoque, pedidos e pagamentos de uma loja virtual.

## 🚀 Desenvolvido por Seven PK

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
- **Stripe & PagSeguro** (Integração com pagamentos)

---

## 📦 Instalação e Configuração

1. **Clone o repositório**
   ```sh
   git clone https://github.com/seven-pk/seven-commerce-api.git
   cd seven-commerce-api
   ```

2. **Instale as dependências**
   ```sh
   npm install
   ```

3. **Configuração do Banco de Dados**
   - Crie um arquivo `.env` na raiz do projeto e adicione:
     ```env
     DATABASE_URL="mysql://usuario:senha@localhost:3306/seven_commerce"
     JWT_SECRET="sua_chave_secreta"
     STRIPE_SECRET_KEY="sua_chave_stripe"
     PAGSEGURO_TOKEN="seu_token_pagseguro"
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
- **POST** `/auth/register` - Cadastro de usuário
- **POST** `/auth/login` - Login e geração de token JWT

### 📦 Produtos
- **GET** `/products` - Listar produtos
- **POST** `/products` - Criar produto
- **PUT** `/products/:id` - Atualizar produto
- **DELETE** `/products/:id` - Remover produto

### 🛒 Pedidos
- **GET** `/orders` - Listar pedidos
- **POST** `/orders` - Criar um pedido

### 🛍️ Checkout
- **POST** `/checkout/stripe` - Pagamento via Stripe
- **POST** `/checkout/pagseguro` - Pagamento via PagSeguro

---

## 🛠️ Contribuição

Se quiser contribuir com o projeto:
1. **Faça um fork** do repositório.
2. **Crie uma branch** com sua feature (`git checkout -b minha-feature`).
3. **Commit suas alterações** (`git commit -m 'Adiciona nova funcionalidade'`).
4. **Faça um push** para a branch (`git push origin minha-feature`).
5. **Abra um Pull Request**.

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usá-lo e modificá-lo conforme necessário.

---

💡 **Seven PK - Soluções para e-commerce!**

