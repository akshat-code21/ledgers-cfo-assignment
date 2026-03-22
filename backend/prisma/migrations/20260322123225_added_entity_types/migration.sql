/*
  Warnings:

  - The values [COMPANY,INDIVIDUAL] on the enum `EntityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EntityType_new" AS ENUM ('PRIVATE_LIMITED', 'PUBLIC', 'ONE_PERSON_COMPANY', 'LLP', 'NON_PROFIT');
ALTER TABLE "Client" ALTER COLUMN "entity_type" TYPE "EntityType_new" USING ("entity_type"::text::"EntityType_new");
ALTER TYPE "EntityType" RENAME TO "EntityType_old";
ALTER TYPE "EntityType_new" RENAME TO "EntityType";
DROP TYPE "public"."EntityType_old";
COMMIT;
