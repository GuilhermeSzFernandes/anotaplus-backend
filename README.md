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
- `GET /categories`, `POST /categories`, `DELETE /categories/:id` — idem. `POST /categories` é `upsert` (por `userId` + `nome`, a constraint única) em vez de `create` puro — o app Android sincroniza a mesma categoria mais de uma vez (ex: categorias padrão que já existem), então precisa ser idempotente

## Deploy no Render

- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm run start:prod`
- Variáveis de ambiente: as mesmas do `.env` (`DATABASE_URL`, `GOOGLE_WEB_CLIENT_ID`, `JWT_SECRET`)
- Antes do primeiro deploy funcionar de verdade, rodar `npx prisma migrate deploy` apontando pro `DATABASE_URL` do Neon (pode ser via um Job/Shell do Render, ou local mesmo, já que o Neon é acessível de fora).

## O que ainda falta (próximos passos)

- O app Android já sincroniza dos dois lados: push (local → nuvem, um item por vez via `POST /entries`/`POST /categories`) e restore (nuvem → local, via `GET /entries`/`GET /categories`, útil pra reinstalar/trocar de aparelho) — ver `SyncManager.kt`/`SyncWorker.kt` no repo do app. Não existe endpoint de upload/download em lote ainda (um item por chamada).
- Sincronização de verdade entre múltiplos aparelhos ao mesmo tempo, com resolução de conflito — hoje é só backup/restore unidirecional, sem lidar com edição simultânea em dois lugares.
- Modelo de assinatura (`Subscription`) e verificação de recibo do Google Play Billing, pra gatear o backup atrás do plano pago — hoje qualquer usuário logado tem backup liberado, sem checar plano nenhum.
