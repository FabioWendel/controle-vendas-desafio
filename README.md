## Sistema Completo de Controle de Vendas: Gerencie Estoque, Vendas e Categorias com Python, FastAPI, Docker, Angular 17 e PrimeNg

**Solução completa para gerenciar seu negócio com eficiência, desde o controle do estoque até relatórios de vendas detalhados. Ideal para pequenas e médias empresas que desejam otimizar suas operações e aumentar a lucratividade.**

## Desafio Técnico

## Funcionalidades:

- **Gerenciamento de Produtos:**
  - Cadastre, edite e visualize seus produtos com facilidade.
  - Inclua informações como nome, descrição, preço, categoria e estoque.
  - Acompanhe o histórico de compras e vendas de cada produto.
  - Utilize filtros avançados para encontrar produtos específicos rapidamente.
- **Controle de Estoque:**
  - Monitore o nível de estoque em tempo real para evitar rupturas.
  - Receba alertas automáticos quando o estoque de um produto estiver baixo.
  - Gere relatórios detalhados de entrada e saída de produtos.
  - Otimize suas compras e reduza custos com base em dados precisos de estoque.
- **Registro de Vendas:**
  - Realize vendas de forma rápida e eficiente, com interface intuitiva.
  - Aplique descontos e promoções para fidelizar seus clientes.
  - Registre pagamentos em diferentes formas (dinheiro, cartão, etc.).
  - Emita notas fiscais personalizadas.
- **Gerenciamento de Categorias:**
  - Crie e organize categorias para seus produtos de forma intuitiva.
  - Facilite a navegação dos clientes em sua loja online ou física.
  - Analise o desempenho de vendas por categoria para tomar decisões estratégicas.
- **Relatórios de Vendas:**
  - Gere relatórios abrangentes de vendas por período, produto, categoria e cliente.
  - Acompanhe o crescimento das vendas ao longo do tempo.
  - Identifique seus produtos mais vendidos e lucrativos.
  - Tome decisões baseadas em dados para aumentar a lucratividade do seu negócio.

## Tecnologias Utilizadas:

**[Python, FastAPI, Docker, PostgreSQL, Angular 17 e PrimeNg]**

- **Python 3.10:** Linguagem de programação versátil e poderosa.
- **FastAPI:** Framework web Python de alto desempenho para APIs RESTful.
- **Docker:** Plataforma de containerização para virtualização de software.
- **PostgreSQL:** Banco de dados relacional robusto e confiável.
- **Angular 17:** Framework JavaScript para desenvolvimento de interfaces web modernas e responsivas.
- **PrimeNg:** Biblioteca de componentes UI para Angular, baseada em Material Design.

## Como Rodar o Sistema:

**Pré-requisitos:**

- Git ([Link para instalação do Git](https://git-scm.com/downloads))
- Docker ([Link para instalação do Docker](https://www.docker.com/get-started))
- Docker Compose ([Link para instalação do Docker Compose](https://docs.docker.com/compose/install/))
- Node.js ([Link para instalação do Node.js](https://nodejs.org/en/download/))
- npm ([Link para instalação do npm](https://www.npmjs.com/get))

**Passos para execução:**

1. **Clone o repositório:**

```bash
git clone https://github.com/FabioWendel/controle-vendas-desafio.git
```

2. **Navegue até o diretório do projeto:**

```bash
cd controle-vendas-desafio
```

3. **Construa e inicie os containers Docker:**

```bash
docker-compose up --build
```

Este comando irá subir o banco de dados, o backend e o frontend da aplicação.

**Acesso ao sistema:**

Acesse o sistema no endereço: [http://localhost:4200/](http://localhost:4200/)

**Estrutura do Projeto:**

- `backend/`: Contém o código do backend desenvolvido em Python com FastAPI.
- `frontend/`: Contém o código do frontend desenvolvido em Angular 17 com PrimeNg.
- `docker-compose.yml`: Arquivo de configuração do Docker Compose.

## Usuários Padrão

Para facilitar o teste do sistema, já foram criados usuários padrão com perfis de comprador e vendedor:

**Comprador:**

- Email: `user1@example.com`
- Senha: `202425`

**Vendedor:**

- Email: `seller1@example.com`
- Senha: `202425`

**Observações:**

- Você pode criar novos usuários com na pagina de login, ele irá cadastrar como cliente.

**Dúvidas ou sugestões? Entre em contato**

**Agradeço a sua atenção!**
