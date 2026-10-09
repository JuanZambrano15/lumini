-- CreateEnum
CREATE TYPE "ItemKind" AS ENUM ('AVATAR', 'HOME');

-- CreateEnum
CREATE TYPE "ItemSlot" AS ENUM ('HEAD', 'FACE', 'BACK', 'HOME_FLOOR', 'HOME_WALL', 'HOME_SHELF', 'HOME_WINDOW');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('ANSWERED', 'BLOCKED', 'REDIRECTED');

-- Los deseos creados por los padres se reemplazan por la tienda y las preguntas a Lumi.
-- Se eliminan sus movimientos de estrellas para poder quitar esos valores del enum.
DELETE FROM "star_transactions" WHERE "reason" IN ('WISH_REQUEST', 'WISH_REFUND');

-- AlterEnum
BEGIN;
CREATE TYPE "StarReason_new" AS ENUM ('ACTIVITY', 'GAME', 'SHOP_PURCHASE', 'AI_QUESTION', 'AI_REFUND');
ALTER TABLE "star_transactions" ALTER COLUMN "reason" TYPE "StarReason_new" USING ("reason"::text::"StarReason_new");
ALTER TYPE "StarReason" RENAME TO "StarReason_old";
ALTER TYPE "StarReason_new" RENAME TO "StarReason";
DROP TYPE "public"."StarReason_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "wishes" DROP CONSTRAINT "wishes_child_id_fkey";

-- AlterTable
ALTER TABLE "children" ADD COLUMN     "ai_enabled" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "wishes";

-- DropEnum
DROP TYPE "WishStatus";

-- CreateTable
CREATE TABLE "shop_items" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "kind" "ItemKind" NOT NULL,
    "slot" "ItemSlot" NOT NULL,
    "cost" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "shop_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_items" (
    "child_id" UUID NOT NULL,
    "item_id" INTEGER NOT NULL,
    "equipped" BOOLEAN NOT NULL DEFAULT true,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "child_items_pkey" PRIMARY KEY ("child_id","item_id")
);

-- CreateTable
CREATE TABLE "ai_questions" (
    "id" UUID NOT NULL,
    "child_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "status" "QuestionStatus" NOT NULL,
    "reason" TEXT,
    "stars_spent" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_items_slug_key" ON "shop_items"("slug");

-- CreateIndex
CREATE INDEX "ai_questions_child_id_created_at_idx" ON "ai_questions"("child_id", "created_at");

-- AddForeignKey
ALTER TABLE "child_items" ADD CONSTRAINT "child_items_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_items" ADD CONSTRAINT "child_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "shop_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_questions" ADD CONSTRAINT "ai_questions_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

