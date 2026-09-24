import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import StudentCard from "../_components/student-card";
import StudentsFilter from "../_components/students-filter";
import { studentSearchParamsCache } from "@/lib/nuqs/student-search-params";
import { SearchParams } from "nuqs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

export default async function StudentsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {

  const { active, q } = studentSearchParamsCache.parse(await searchParams);

  const students = await prisma.student.findMany({
    where: {
      status: active ? "ACTIVE" : undefined,
      name: q ? {
        contains: q,
        mode: "insensitive"
      } : undefined
    },
    include: {
      enrollments: {
        include: {
          tuitionPayments: true,
        },
      },
    },
    orderBy: {
      name: "asc"
    }
  });

  const courses = await prisma.classPlan.findMany({
    include: {
      course: true,
      modality: true
    }
  })

  const t = await getTranslations("StudentsPage");
  return (
    <div className="flex flex-col gap-10 mt-8 lg:mt-12">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h1 className="font-display text-3xl lg:text-4xl">{t("title")}</h1>
          <Link href={"/students/new"}>
            <Button size="lg" className="flex items-center">
              <PlusCircleIcon />
              <span>{t("newButton")}</span>
            </Button>
          </Link>
        </div>
        <h2 className="font-display text-secondary-foreground mt-2 lg:mt-0">{t("description")}</h2>
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
