# Anota+ Backend

Backend NestJS + Prisma pro backup na nuvem do [Anota+](https://github.com/GuilhermeSzFernandes/anotaplus). Autentica com Google Sign-In (o app manda um ID token, esse backend verifica e emite sua própria sessão em JWT) e guarda `entries`/`categories` no Neon (Postgres).

## Rodando localmente

1. `npm install`
2. Copie `.env.example` pra `.env` e preencha:
   - `DATABASE_URL`: connection string do Neon (painel do Neon → Connection Details)
   - `GOOGLE_WEB_CLIENT_ID`: o Client ID **tipo Web application** criado no Google Cloud Console (não o tipo Android)
   - `JWT_SECRET`: qualquer valor aleatório (`openssl rand -hex 32`)
3. `npx prisma migrate dev` — cria as tabelas no Neon a partir de `prisma/schema.prisma`
4. `npm run start:dev`

## Endpoints

- `POST /auth/google` — body `{ "idToken": "..." }`, devolve `{ accessToken, user }`
- `GET /entries`, `POST /entries`, `DELETE /entries/:id` — protegidos por `Authorization: Bearer <accessToken>`
- `GET /categories`, `POST /categories`, `DELETE /categories/:id` — idem

## Deploy no Render

- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm run start:prod`
- Variáveis de ambiente: as mesmas do `.env` (`DATABASE_URL`, `GOOGLE_WEB_CLIENT_ID`, `JWT_SECRET`)
- Antes do primeiro deploy funcionar de verdade, rodar `npx prisma migrate deploy` apontando pro `DATABASE_URL` do Neon (pode ser via um Job/Shell do Render, ou local mesmo, já que o Neon é acessível de fora).

## O que ainda falta (próximos passos)

- Endpoint de sync de verdade (hoje `POST /entries` só cria um registro novo; ainda não há upload em lote nem resolução de conflito entre dispositivos).
- Modelo de assinatura (`Subscription`) e verificação de recibo do Google Play Billing, pra gatear o backup atrás do plano pago.
- Lado Android: tela de login com Google (Credential Manager), chamada pro `POST /auth/google`, e guardar o `accessToken` retornado.
