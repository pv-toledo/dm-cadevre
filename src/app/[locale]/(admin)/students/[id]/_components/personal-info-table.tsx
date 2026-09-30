import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Student } from "@/generated/prisma/client"
import EditStudentDialog from "./edit-student-dialog"
import { calculateAge, formatPhoneNumber } from "@/lib/utils"
import { AvatarEditInput } from "../../../_components/avatar-edit-input"
import { getStudentProfilePicture } from "../../actions"
import { getTranslations } from "next-intl/server"

type PersonalInfoTableProps = {
    student: Student
}

export default async function PersonalInfoTable({ student }: PersonalInfoTableProps) {

    const t = await getTranslations("PersonalInfoTable")
    const studentAge = calculateAge(student.birthDate)
    const studentProfilePicture = await getStudentProfilePicture(student.id)

    return (
        <div className="grid grid-cols-1 place-items-center gap-8 pb-20 lg:pb-0 lg:gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden border border-foreground/50 rounded-md w-full order-2 lg:order-1">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="dark bg-sidebar text-sidebar-foreground hover:bg-sidebar">
                            <TableHead colSpan={2} className="p-0">
                                <div className="flex items-center justify-between px-2 py-3">
                                    <p>{t("title")}</p>
                                    <EditStudentDialog student={student} />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{t("name")}: </TableCell>
                            <TableCell>{student.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("birthDate")}: </TableCell>
                            <TableCell>{student.birthDate.toLocaleDateString("pt-BR", {timeZone: "UTC"})}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("age")}: </TableCell>
                            <TableCell>{studentAge}</TableCell>
                        </TableRow>
                        {studentAge < 18 ? (
                            <>
                                <TableRow>
                                    <TableCell>{t("responsibleName")}: </TableCell>
                                    <TableCell>{student.responsibleName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{t("responsiblePhoneNumber")}: </TableCell>
                                    <TableCell>{formatPhoneNumber(student.responsiblePhoneNumber)}</TableCell>
                                </TableRow>
                            </>

                        ) : (

                            <TableRow>
                                <TableCell>{t("studentPhoneNumber")}: </TableCell>
                                <TableCell>{formatPhoneNumber(student.studentPhoneNumber)}</TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell>{t("church")}: </TableCell>
                            <TableCell>{student.church}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("address")}: </TableCell>
                            <TableCell className="whitespace-normal wrap-break-word">{student.address}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="order-1 lg:order2">
                <AvatarEditInput student={student} studentProfilePictureUrl={studentProfilePicture} />
            </div>
        </div>
    )
}