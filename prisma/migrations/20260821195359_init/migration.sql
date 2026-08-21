-- CreateEnum
CREATE TYPE "student_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "course_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "modality_types" AS ENUM ('INDIVIDUAL', 'GROUP');

-- CreateEnum
CREATE TYPE "enrollment_status" AS ENUM ('ACTIVE', 'LOCKED', 'ENDED');

-- CreateEnum
CREATE TYPE "instrument_status" AS ENUM ('AVAILABLE', 'LOANED', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "instrument_condition" AS ENUM ('PERFECT', 'DEFECTIVE');

-- CreateEnum
CREATE TYPE "payment_methods" AS ENUM ('CASH', 'PIX');

-- CreateEnum
CREATE TYPE "user_roles" AS ENUM ('ADMIN', 'STAFF', 'STUDENT');

-- CreateEnum
CREATE TYPE "entity_types" AS ENUM ('STUDENT', 'COURSE', 'ENROLLMENT', 'CLASS_PLAN', 'MODALITY', 'INSTRUMENT', 'LOAN', 'MAINTENANCE_FEE', 'TUITION_PAYMENT', 'MAINTENANCE_FEE_PAYMENT', 'USER_PROFILE');

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "student_phone_number" TEXT,
    "responsible_name" TEXT,
    "responsible_phone_number" TEXT,
    "church" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "photo_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "student_status" NOT NULL DEFAULT 'ACTIVE',
    "email" TEXT,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "course_status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modalities" (
    "type" "modality_types" NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modalities_pkey" PRIMARY KEY ("type")
);

-- CreateTable
CREATE TABLE "class_plans" (
    "id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "modality_type" "modality_types" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "class_plan_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "status" "enrollment_status" NOT NULL DEFAULT 'ACTIVE',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locked_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instruments" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "course_id" UUID NOT NULL,
    "tag" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT,
    "serial_number" TEXT,
    "condition" "instrument_condition" NOT NULL DEFAULT 'PERFECT',
    "condition_description" TEXT,
    "status" "instrument_status" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" UUID NOT NULL,
    "instrument_id" UUID NOT NULL,
    "enrollment_id" UUID NOT NULL,
    "loan_condition" "instrument_condition" NOT NULL,
    "loan_condition_description" TEXT,
    "loaned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returned_at" TIMESTAMP(3),
    "return_condition" "instrument_condition",
    "return_condition_description" TEXT,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tuition_payments" (
    "id" UUID NOT NULL,
    "enrollment_id" UUID NOT NULL,
    "reference_month" DATE NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "method" "payment_methods",
    "due_date" DATE NOT NULL,
    "paid_at" DATE,
    "confirmed_by_user_id" UUID,
    "confirmed_at" DATE,

    CONSTRAINT "tuition_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_fees" (
    "id" UUID NOT NULL,
    "enrollment_id" UUID NOT NULL,
    "reference_year" DATE NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,

    CONSTRAINT "maintenance_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_fee_payments" (
    "id" UUID NOT NULL,
    "maintenance_fee_id" UUID NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "paid_at" DATE NOT NULL,
    "method" "payment_methods" NOT NULL,
    "confirmed_by_user_id" UUID NOT NULL,

    CONSTRAINT "maintenance_fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "role" "user_roles" NOT NULL,
    "student_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" "entity_types" NOT NULL,
    "entity_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "class_plans_course_id_modality_type_key" ON "class_plans"("course_id", "modality_type");

-- CreateIndex
CREATE UNIQUE INDEX "instruments_tag_key" ON "instruments"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "tuition_payments_enrollment_id_reference_month_key" ON "tuition_payments"("enrollment_id", "reference_month");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_fees_enrollment_id_reference_year_key" ON "maintenance_fees"("enrollment_id", "reference_year");

-- AddForeignKey
ALTER TABLE "class_plans" ADD CONSTRAINT "class_plans_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_plans" ADD CONSTRAINT "class_plans_modality_type_fkey" FOREIGN KEY ("modality_type") REFERENCES "modalities"("type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_class_plan_id_fkey" FOREIGN KEY ("class_plan_id") REFERENCES "class_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruments" ADD CONSTRAINT "instruments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_instrument_id_fkey" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tuition_payments" ADD CONSTRAINT "tuition_payments_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tuition_payments" ADD CONSTRAINT "tuition_payments_confirmed_by_user_id_fkey" FOREIGN KEY ("confirmed_by_user_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_fees" ADD CONSTRAINT "maintenance_fees_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_fee_payments" ADD CONSTRAINT "maintenance_fee_payments_maintenance_fee_id_fkey" FOREIGN KEY ("maintenance_fee_id") REFERENCES "maintenance_fees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_fee_payments" ADD CONSTRAINT "maintenance_fee_payments_confirmed_by_user_id_fkey" FOREIGN KEY ("confirmed_by_user_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "students" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "modalities" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "class_plans" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "enrollments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "instruments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "loans" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "tuition_payments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "maintenance_fees" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "maintenance_fee_payments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
    REVOKE ALL ON TABLE "public"."_prisma_migrations" FROM anon, authenticated;
  END IF;
END $$;

CREATE UNIQUE INDEX "enrollments_student_course_active_key"
ON "enrollments" ("student_id", "course_id")
WHERE "status" = 'ACTIVE';

CREATE UNIQUE INDEX "loans_instrument_active_key"
ON "loans" ("instrument_id")
WHERE "returned_at" IS NULL;
