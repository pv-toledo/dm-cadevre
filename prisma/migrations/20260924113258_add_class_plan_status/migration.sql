-- CreateEnum
CREATE TYPE "class_plan_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "class_plans" ADD COLUMN     "status" "class_plan_status" NOT NULL DEFAULT 'ACTIVE';
