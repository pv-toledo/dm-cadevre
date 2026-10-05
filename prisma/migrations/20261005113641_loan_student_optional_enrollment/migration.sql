/*
  Warnings:

  - Added the required column `student_id` to the `loans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "loans" DROP CONSTRAINT "loans_enrollment_id_fkey";

-- AlterTable
ALTER TABLE "loans" ADD COLUMN     "student_id" UUID NOT NULL,
ALTER COLUMN "enrollment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
