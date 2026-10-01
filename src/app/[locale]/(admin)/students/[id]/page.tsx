import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getTranslations } from "next-intl/server"
import { getSingleStudent } from "../actions"
import UserBasicInfo from "./_components/user-basic-info"
import PersonalInfoCard from "./_components/personal-info-card"

type SingleStudentPageProps = {
    params: Promise<{ id: string }>
}

export default async function SingleStudentPage({ params }: SingleStudentPageProps) {
    const { id } = await params
    const student = await getSingleStudent(id)
    const t = await getTranslations("SingleStudentPage")

    return (
        <div className="flex flex-col gap-5 mt-5 pb-20 lg:mt-8 lg:gap-6">
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
                        {student.name}
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            
            <div className="flex flex-col gap-10 items-start justify-center">
                <UserBasicInfo student={student} />
                <PersonalInfoCard student={student} />
            </div>

        </div>
    )
}