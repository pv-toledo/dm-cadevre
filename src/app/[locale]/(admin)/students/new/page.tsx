import { getTranslations } from "next-intl/server";
import NewStudentForm from "../../_components/new-student-form";
import { getActiveCourses } from "../actions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default async function NewStudentPage() {
    const t = await getTranslations("NewStudentPage")
    const activeCourses = await getActiveCourses()

    return (
        <div className="flex flex-col gap-5 mt-5 lg:mt-8 lg:gap-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">{t("breadCrumb.home")}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/students">{t("breadCrumb.students")}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="underline">
                        <span className="text-sidebar">{t("breadCrumb.newStudent")}</span>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="font-display text-3xl lg:text-4xl">{t("title")}</h1>

            <NewStudentForm activeCourses={activeCourses} />
        </div>
    )
}