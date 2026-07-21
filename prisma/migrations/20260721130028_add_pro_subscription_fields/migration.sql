-- AlterTable
ALTER TABLE "users" ADD COLUMN     "proAtivo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "proAtualizadoEm" TIMESTAMP(3),
ADD COLUMN     "proProductId" TEXT,
ADD COLUMN     "proPurchaseToken" TEXT;
