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

- `POST /auth/google` — body `{ "idToken": "..." }`, devolve `{ accessToken, user }` (`user.pro` reflete `proAtivo` no momento do login, pro app já saber se pode oferecer backup sem precisar de outra chamada)
- `GET /entries`, `POST /entries`, `PATCH /entries/:id`, `DELETE /entries/:id` — protegidos por `Authorization: Bearer <accessToken>` **e** por assinatura PRO ativa (`ProActiveGuard`, 403 se `proAtivo` for `false`). `PATCH` recebe o mesmo corpo do `POST` (substitui o registro inteiro, não é patch parcial) e usa `updateMany({ where: { id, userId } })` — mesmo truque do `DELETE`, embute o dono na query em vez de um `findUnique` + checagem separada
- `GET /categories`, `POST /categories`, `DELETE /categories/:id` — idem (`Authorization` + PRO). `POST /categories` é `upsert` (por `userId` + `nome`, a constraint única) em vez de `create` puro — o app Android sincroniza a mesma categoria mais de uma vez (ex: categorias padrão que já existem), então precisa ser idempotente
- `POST /billing/sync` — body `{ productId, purchaseToken, active }`, protegido só por `Authorization` (não por `ProActiveGuard`, óbvio — é esse endpoint que ativa o PRO). O app chama isso sempre que consulta o Play Billing localmente (no login, ao abrir o app, depois de comprar/cancelar) e reporta o que encontrou. **Não verifica o `purchaseToken` contra a API do Google Play Developer** (precisaria de uma service account com Android Publisher API, que ainda não existe) — confia no que o app relata. Gap conhecido: um app adulterado poderia mandar `active: true` sem ter comprado nada

## Deploy no Render

- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm run start:prod`
- Variáveis de ambiente: as mesmas do `.env` (`DATABASE_URL`, `GOOGLE_WEB_CLIENT_ID`, `JWT_SECRET`)
- Antes do primeiro deploy funcionar de verdade, rodar `npx prisma migrate deploy` apontando pro `DATABASE_URL` do Neon (pode ser via um Job/Shell do Render, ou local mesmo, já que o Neon é acessível de fora).

## O que ainda falta (próximos passos)

- O app Android já sincroniza dos dois lados: push (local → nuvem, um item por vez via `POST /entries`/`POST /categories`) e restore (nuvem → local, via `GET /entries`/`GET /categories`, útil pra reinstalar/trocar de aparelho) — ver `SyncManager.kt`/`SyncWorker.kt` no repo do app. Não existe endpoint de upload/download em lote ainda (um item por chamada).
- Sincronização de verdade entre múltiplos aparelhos ao mesmo tempo, com resolução de conflito — hoje é só backup/restore unidirecional, sem lidar com edição simultânea em dois lugares.
- Verificar o `purchaseToken` do `POST /billing/sync` contra a API do Google Play Developer (`purchases.subscriptions.get`), em vez de confiar no que o app relata — precisa de uma service account do Google Cloud com acesso à Android Publisher API, vinculada no Play Console (Configurações > Acesso à API).
