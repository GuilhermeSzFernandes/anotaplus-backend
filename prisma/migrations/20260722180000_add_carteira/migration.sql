-- AlterTable
ALTER TABLE "entries" ADD COLUMN     "carteira" TEXT;

-- CreateTable
CREATE TABLE "carteiras" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "carteiras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carteiras_userId_nome_key" ON "carteiras"("userId", "nome");

-- AddForeignKey
ALTER TABLE "carteiras" ADD CONSTRAINT "carteiras_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
