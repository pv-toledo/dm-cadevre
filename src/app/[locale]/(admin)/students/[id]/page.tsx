import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getTranslations } from "next-intl/server"
import { getActiveCourses, getSingleStudentCompleteInfo } from "../actions"
import UserBasicInfo from "./_components/user-basic-info"
import PersonalInfoCard from "./_components/personal-info-card"
import EnrollmentDetailCard from "./_components/enrollment-detail-card"
import StudentLoanCard from "./_components/student-loan-card"

type SingleStudentPageProps = {
    params: Promise<{ id: string }>
}

export default async function SingleStudentPage({ params }: SingleStudentPageProps) {
    const { id } = await params
    const student = await getSingleStudentCompleteInfo(id)
    const activeCourses = await getActiveCourses()
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
                <StudentLoanCard student={student}/>
                <PersonalInfoCard student={student} />
                <EnrollmentDetailCard student={student} activeCourses={activeCourses} />
                
            </div>

        </div>
    )
}