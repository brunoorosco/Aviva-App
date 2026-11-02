# Aviva App

Plataforma de gestão para igrejas cristãs, com foco no **Avivamento em Cristo**. Centraliza em um único sistema a operação da igreja: membros, batismos, discipulado, células, ministérios, eventos e cultos, cursos infantis, programas missionários, ebooks e check-in via QR Code.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## Funcionalidades

- **Membros** — cadastro, grupos/células e gestão de membros
- **Batismos** — registro e acompanhamento
- **Discipulado** — acompanhamento de discipulado
- **Células (CEMs)** — gestão de células e ministérios
- **Eventos & Cultos** — calendários, tipos de eventos e configuração de cultos
- **Programas missionários** — Casa de Paz, Visita de Paz, Rede, Conferência, Consagração, Encontro/Reencontro com Deus
- **Cursos infantis** — gestão de cursos para crianças
- **Ebooks** — distribuição de conteúdo digital
- **Check-in QR Code** — presença via QR Code
- **Integração WhatsApp** — envio de mensagens
- **Dashboard & Relatórios** — gráficos, exportação PDF/Excel
- **Autenticação & Permissões** — NextAuth (Google OAuth + JWT) com RBAC

## Tecnologias

| Categoria | Tecnologias |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org) + React 18 |
| Linguagem | TypeScript 5.9 |
| Estilo | [Tailwind CSS](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com) (shadcn/ui) |
| UI | Framer Motion, lucide-react, React Hot Toast, SweetAlert2 |
| Estado / Dados | Redux Toolkit, SWR, React Hook Form + Zod |
| Autenticação | NextAuth (Google OAuth + JWT), bcrypt |
| Banco de dados | MongoDB (Atlas) + MySQL (PlanetScale) |
| Integrações | Cloudinary, Nodemailer (SMTP), Google Spreadsheet |
| PDF / Export | jsPDF, Puppeteer, pdf-lib, XLSX |
| QR Code | qrcode, qrcode.react, html5-qrcode |
| PWA | next-pwa |
| Testes | Jest + ts-jest |
| Deploy | [Vercel](https://vercel.com) |

## Estrutura do projeto

```
src/
├── pages/              # Rotas (pages router) e endpoints de API
│   ├── api/            # API routes: auth, protected, ebook, qrcode, etc.
│   └── sede/           # Área da sede: membros, batismo, ebook
├── services/           # Camada de negócio (um serviço por domínio)
├── domain/models/      # Entidades do domínio
├── infra/              # Repositórios (MongoDB), criptografia
├── components/         # Componentes reutilizáveis e por feature
├── middlewares/        # Guards de permissão
├── hooks/, lib/, utils/# Utilitários e hooks
├── providers/          # Providers de contexto
└── tests/              # Testes (Jest)
```

## Como rodar em desenvolvimento

### 1. Pré-requisitos

- Node.js 18+
- [PlanetScale CLI](https://planetscale.com/docs/cli) (opcional, para conectar ao MySQL remotamente)
- Credenciais de MongoDB, Cloudinary, SMTP e Google OAuth

### 2. Instalar dependências

```bash
npm install
# ou
yarn
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Variáveis principais (ver `.env.example`):

```env
# Banco de dados
DATABASE_URL=mysql://usuario:senha@host:3306/db-churches
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/db?retryWrites=true&w=majority

# Autenticação
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
JWT_KEY=
SALT=

# E-mail (SMTP)
EMAIL=
EMAIL_HOST=
EMAIL_PASSWORD=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> **MySQL (PlanetScale):** para conectar ao banco remotamente:
>
> ```bash
> pscale connect <banco> <ramo> --port 3309
> ```

### 4. Iniciar o projeto

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### 5. Rodar testes

```bash
npm test
```

## Build e produção

```bash
npm run build
npm start
```

## Docker

O projeto inclui `Dockerfile` e `docker-compose.yml` para desenvolvimento local com proxy Nginx:

```bash
docker compose up --build
```

## Deploy

Este projeto é publicado na [Vercel](https://vercel.com). Veja a [documentação de deploy do Next.js](https://nextjs.org/docs/deployment) para mais detalhes.

## Licença

Projeto proprietário — Todos os direitos reservados. © 2026 Bruno Orosco