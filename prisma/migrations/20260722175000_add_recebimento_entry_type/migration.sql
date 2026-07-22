-- AlterEnum
-- Precisa ficar sozinha nessa migration: Postgres não deixa usar um valor
-- de enum recém-adicionado na mesma transação em que ele foi criado.
ALTER TYPE "EntryType" ADD VALUE 'RECEBIMENTO';
