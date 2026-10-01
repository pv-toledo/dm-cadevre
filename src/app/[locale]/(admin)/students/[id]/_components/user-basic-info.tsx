import { Student } from "@/generated/prisma/client"
import { AvatarEditInput } from "./avatar-edit-input"
import { getStudentProfilePicture } from "../../actions"
import { calculateAge, formatPhoneNumber } from "@/lib/utils"

type UserBasicInfoProps = {
    student: Student
}

export default async function UserBasicInfo({ student }: UserBasicInfoProps) {
    const studentProfilePictureUrl = await getStudentProfilePicture(student.id)
    const studentAge = calculateAge(student.birthDate)
    return (
        <div className="flex gap-4 items-center justify-center">
            <AvatarEditInput student={student} studentProfilePictureUrl={studentProfilePictureUrl} />
            <div className="flex flex-col gap-0.5 lg:gap-1">
                <p className="font-display text-xl lg:text-2xl">{student.name}</p>
                {studentAge < 18 ? (
                    <p className="font-display text-xs lg:text-sm">Tel. responsável: {formatPhoneNumber(student.responsiblePhoneNumber)}</p>
                ) : (
                    <p className="font-display text-xs lg:text-sm">Tel. aluno: {formatPhoneNumber(student.studentPhoneNumber)}</p>
                )}
                <p className="font-display text-xs lg:text-sm">Igreja: {student.church ? student.church : "Não informado"}</p>
            </div>
        </div>
    )
}