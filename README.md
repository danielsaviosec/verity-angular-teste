# Verity Angular Teste

Aplicação Angular 20 (standalone + SSR) com um formulário de **cadastro de usuário em múltiplas etapas**.

## Funcionalidades

- **Cadastro em 3 etapas**: Dados Pessoais, Informações Residenciais e Informações Profissionais.
- **Validações customizadas**: CPF, telefone, data de nascimento e salário.
- **Máscaras de input**: CPF, telefone, CEP, data e moeda.
- **Busca de endereço por CEP** (integração ViaCEP, com fallback mock via interceptor).
- **Tela de resumo** com edição de cada etapa antes de finalizar.
- **Exportação em PDF** dos dados cadastrados (`jspdf`).
- **Gerenciamento de estado** com Signals (`RegistrationStore`).
- **Localização pt-BR** e UI com Angular Material + Tailwind CSS.
- **SSR** com Angular Universal (Express).

## Stack

- Angular 20 (standalone, zoneless, SSR)
- Angular Material + Tailwind CSS 4
- RxJS, jsPDF
- Jest (testes unitários), ESLint + Prettier, Husky + lint-staged

## Como executar

### Localmente

```bash
npm install
npm start
```

Acesse `http://localhost:4200/` (redireciona para `/cadastro`).

### Outros comandos

```bash
npm run build           # build de produção
npm test                # testes unitários (Jest)
npm run test:coverage   # testes com cobertura
npm run lint            # análise de lint
```

## Docker

O projeto inclui um `Dockerfile` multi-stage (deps → build → produção, rodando o servidor SSR na porta `4000`) e um `docker-compose.yml` com dois serviços:

- **dev**: ambiente de desenvolvimento com hot reload na porta `4200`.
- **prod**: build de produção servindo via SSR na porta `4000`.

### Desenvolvimento

```bash
docker compose up dev
```

Acesse `http://localhost:4200/`.

### Produção

```bash
docker compose up prod --build
```

Acesse `http://localhost:4000/`.
