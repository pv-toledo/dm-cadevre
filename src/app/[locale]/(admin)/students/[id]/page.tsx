import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getTranslations } from "next-intl/server"
import { getSingleStudent, getStudentProfilePicture } from "../actions"
import { AvatarEditInput } from "../../_components/avatar-edit-input"

type SingleStudentPageProps = {
    params: Promise<{ id: string }>
}

export default async function SingleStudentPage({ params }: SingleStudentPageProps) {
    const { id } = await params
    const student = await getSingleStudent(id)
    const studentProfilePicture = await getStudentProfilePicture(student.id)
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
            <AvatarEditInput student={student} studentProfilePictureUrl={studentProfilePicture} />
        </div>
    )
}