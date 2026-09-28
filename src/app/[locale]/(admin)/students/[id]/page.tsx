import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getTranslations } from "next-intl/server"
import { getSingleStudent, getStudentProfilePicture } from "../actions"
import { AvatarEditInput } from "../../_components/avatar-edit-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateAge, formatPhoneNumber } from "@/lib/utils"
import { SquarePen } from "lucide-react"
import EditStudentDialog from "../../_components/edit-student-dialog"

type SingleStudentPageProps = {
    params: Promise<{ id: string }>
}

export default async function SingleStudentPage({ params }: SingleStudentPageProps) {
    const { id } = await params
    const student = await getSingleStudent(id)
    const studentAge = calculateAge(student.birthDate)
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

            <div className="grid grid-cols-1 place-items-center gap-8 pb-20 lg:pb-0 lg:gap-12 lg:grid-cols-[2fr_1fr]">
                <Card className="flex flex-col gap-3 pb-0 bg-muted/10 w-full">
                    <CardHeader className="flex justify-between">
                        <CardTitle className="text-lg">Informações pessoais</CardTitle>
                        <EditStudentDialog student={student}/>
                    </CardHeader>
                    <CardContent className="bg-white pb-2 pt-2 px-0 flex flex-col gap-2">
                        <div className="flex items-center gap-2 border-b border-muted-foreground/20 py-2 px-4">
                            <span className="font-semibold text-base">Nome: </span>
                            <span className="font-display text-base">{student.name}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-muted-foreground/20 py-2 px-4">
                            <div className="flex gap-2 items-center">
                                <span className="font-semibold text-base">Data de nascimento: </span>
                                <span className="font-display text-base">{student.birthDate.toLocaleDateString("pt-BR")}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="font-semibold text-base">Idade: </span>
                                <span className="font-display text-base">{studentAge} anos</span>
                            </div>
                        </div>

                        {studentAge < 18 ? (
                            <>
                                <div className="flex items-center gap-2 border-b border-muted-foreground/20 py-2 px-4">
                                    <span className="font-semibold text-base">Nome do responsável: </span>
                                    <span className="font-display text-base">{student.responsibleName}</span>
                                </div>
                                <div className="flex items-center gap-2 border-b border-muted-foreground/20 py-2 px-4">
                                    <span className="font-semibold text-base">Telefone do responsável: </span>
                                    <span className="font-display text-base">{formatPhoneNumber(student.responsiblePhoneNumber)}</span>
                                </div>
                            </>

                        ) : (
                            <div className="flex items-center gap-2 border-b border-muted-foreground/20 py-2 px-4">
                                <span className="font-semibold text-base">Telefone do aluno: </span>
                                <span className="font-display text-base">{student.studentPhoneNumber}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 border-b border-muted-foreground/20 py-2 px-4">
                            <span className="font-semibold text-base">Igreja: </span>
                            <span className="font-display text-base">{student.church}</span>
                        </div>
                        <div className="flex items-center gap-2 py-2 px-4">
                            <span className="font-semibold text-base">Endereço: </span>
                            <span className="font-display text-base">{student.address}</span>
                        </div>
                    </CardContent>
                </Card>
                <AvatarEditInput student={student} studentProfilePictureUrl={studentProfilePicture} />
            </div>

        </div>
    )
}