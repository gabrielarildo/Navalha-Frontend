# 💈 Navalha — Frontend

Site web da barbearia **Navalha**, construído em **React + Vite** consumindo a **Navalha API**
(.NET 10). Projeto acadêmico da disciplina de Programação Web 2 — Etec Comendador João Rays.

Segue exatamente o diagrama de casos de uso fornecido: login, cadastro, registro de
agendamento (com validação de horário disponível), cancelamento de agendamento e validação de
agendamento pelo barbeiro.

## ✨ Funcionalidades

- **Fazer Login** — autenticação via JWT (`/api/auth/login`), com tratamento de erro de
  credencial inválida e redirecionamento conforme o perfil (Cliente ou Barbeiro/Admin).
- **Realizar Cadastro** — cria a conta de acesso (`/api/auth/register`) e o registro de
  cliente (`/api/clientes`) em um único formulário.
- **Registrar Agendamento** — fluxo guiado: serviço → barbeiro → data/horário (consultando
  `/api/barbeiros/{id}/horarios-disponiveis`) → observações → confirmação
  (`POST /api/agendamentos`).
- **Cancelar Agendamento** — disponível no histórico do cliente e no painel do barbeiro,
  enquanto o horário não tiver passado (`PATCH /api/agendamentos/{id}/cancelar`).
- **Validar Agendamento** — painel do barbeiro lista os agendamentos e permite confirmar,
  concluir ou cancelar (`PATCH /api/agendamentos/{id}/status`).

## 🗂️ Estrutura

```
src/
  components/   componentes reutilizáveis (cards, navbar, badges, alerts...)
  pages/        telas da aplicação (home, login, cadastro, cliente/, barbeiro/)
  services/     todas as chamadas à API, organizadas por recurso (axios)
  routes/       rotas da aplicação e proteção de rotas privadas
  context/      contexto de autenticação (usuário logado, token, vínculos)
  styles/       design system (tokens de cor, tipografia e componentes em CSS puro)
  utils/        formatação de datas, moeda e horários
```

## ⚙️ Como executar

### 1. Configure e rode a Navalha API
Siga o `README.md` do projeto da API (`navalha-api-main`). Por padrão ela roda em
`http://localhost:5089`.

### 2. Configure o endereço da API neste projeto
Edite o arquivo `.env` (já criado com um valor padrão):

```
VITE_API_URL=http://localhost:5089/api
```

### 3. Instale as dependências e rode o frontend

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## 🔑 Sobre login e cadastro

A API trata `Usuario` (login) e `Cliente`/`Barbeiro` (operacional) como entidades separadas.
Por isso:

- Ao se cadastrar pela tela **Cadastro**, o site cria automaticamente o `Usuario` e o `Cliente`
  vinculados pelo mesmo e-mail.
- Um **barbeiro** que já tenha uma conta `Usuario` (role `Barbeiro`) escolhe, no primeiro
  acesso, qual cadastro de `Barbeiro` da barbearia é o seu — essa escolha fica salva no
  navegador.
- Usuários com role `Admin` (cadastrados manualmente pela API) acessam o mesmo painel do
  barbeiro, mas com a visão de **todos** os agendamentos da barbearia.

## 🛠️ Tecnologias

React · Vite · React Router · Axios · React Icons · CSS puro
