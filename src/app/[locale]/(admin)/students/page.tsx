import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import StudentCard from "../_components/student-card";
import StudentsFilter from "../_components/students-filter";
import { studentSearchParamsCache } from "@/lib/nuqs/student-search-params";
import { SearchParams } from "nuqs/server";

export default async function StudentsPage({searchParams}: {searchParams:Promise<SearchParams>}) {

  const { active } = studentSearchParamsCache.parse(await searchParams);

  const students = await prisma.student.findMany({
    where: active ? { status: "ACTIVE" } : undefined,
    include: {
      enrollments: {
        include: {
          tuitionPayments: true,
        },
      },
    },
    orderBy: {
      name: "desc"
    }
  });

  const t = await getTranslations("StudentsPage");
  return (
    <div className="flex flex-col gap-10 mt-8 lg:mt-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl lg:text-3xl">{t("title")}</h1>
        <h2 className="font-display text-secondary-foreground">{t("description")}</h2>
      </div>
      <StudentsFilter />
      <section className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </section>
    </div>
  );
}
