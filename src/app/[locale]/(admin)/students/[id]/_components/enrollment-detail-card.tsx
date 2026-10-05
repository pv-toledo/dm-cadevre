import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoursesWithClassPlans, StudentCompleteInfo } from "../../actions";
import { getLocale, getTranslations } from "next-intl/server";
import StudentEnrollmentBadge from "./student-enrollment-badge";
import { cookies } from "next/headers";

type EnrollmentDatailCardProps = {
  student: StudentCompleteInfo;
  activeCourses: CoursesWithClassPlans;
};

export default async function EnrollmentDetailCard({
  student,
  activeCourses,
}: EnrollmentDatailCardProps) {
  const t = await getTranslations("EnrollmentDetailCard");

  const modalityLabel: Record<string, string> = {
    GROUP: t("groupModality"),
    INDIVIDUAL: t("individualModality"),
  } as const;

  console.log(
    student.enrollments.map((e) => ({
      status: e.status,
      startedAt: e.startedAt.toISOString(),
      lockedAt: e.lockedAt?.toISOString(),
      endedAt: e.endedAt?.toISOString(),
    })),
  );

  const timeZone = (await cookies()).get("timezone")?.value ?? "UTC";
  const locale = await getLocale();

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-muted-foreground/30">
        <CardTitle className="text-base lg:text-lg">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {student.enrollments.map((e) => (
          <div key={e.id} className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="font-display font-medium text-sm lg:text-base">
                {
                  activeCourses.find(
                    (course) => course.id === e.classPlan.courseId,
                  )?.name
                }{" "}
                - {modalityLabel[e.classPlan.modalityType]}
              </p>

              {e.status === "ACTIVE" && (
                <p className="text-xs lg:text-sm text-muted-foreground">
                  {t("startDate")}:{" "}
                  {e.startedAt.toLocaleDateString(locale, { timeZone })}
                </p>
              )}

              {e.status === "LOCKED" && (
                <p className="text-xs lg:text-sm text-muted-foreground">
                  {t("lockingDate")}:{" "}
                  {e.lockedAt?.toLocaleDateString(locale, { timeZone })}
                </p>
              )}

              {e.status === "ENDED" && (
                <p className="text-xs lg:text-sm text-muted-foreground">
                  {t("endingDate")}:{" "}
                  {e.endedAt?.toLocaleDateString(locale, { timeZone })}
                </p>
              )}
            </div>

            <StudentEnrollmentBadge enrollment={e} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
