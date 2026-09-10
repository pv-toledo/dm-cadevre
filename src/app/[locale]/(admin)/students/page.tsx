import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import StudentCard from "../_components/student-card";

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    include: {
      enrollments: {
        include: {
          tuitionPayments: true,
        },
      },
    },
  });

  const t = await getTranslations("StudentsPage");
  return (
    <div className="flex flex-col gap-10 mt-8 lg:mt-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl lg:text-3xl">{t("title")}</h1>
        <h2 className="font-display text-secondary-foreground">{t("description")}</h2>
      </div>
      <section className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </section>
    </div>
  );
}
