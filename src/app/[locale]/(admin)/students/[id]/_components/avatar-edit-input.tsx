"use client"

import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import { Student } from "@/generated/prisma/client";
import { getInitials } from "@/lib/utils";
import {  updateStudentPhotoPath, uploadImage } from "../../actions";
import { convertToWebp } from "@/lib/image";
import { useRouter } from "@/i18n/navigation";

const notSupportedTypes = [
    "HEIC",
    "HEIF"
]

type AvatarEditInputProps = {
    student: Student
    studentProfilePictureUrl: string | undefined
}

export function AvatarEditInput({ student, studentProfilePictureUrl }: AvatarEditInputProps) {

    const router = useRouter()

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (!file) return

        const extension = file.name.split(".").pop()?.toUpperCase()

        if (extension && notSupportedTypes.includes(extension)) {
            toast.add({
                type: "error",
                description: `${extension} files are no supported`
            })

            return
        }

        const webpFile = await convertToWebp(file)
        const {data} = await uploadImage(webpFile, student.id)

        if (!data) {
            throw new Error("Failed updating student profile picture")
        }

        await updateStudentPhotoPath(student.id, data.path)

        router.refresh()
    }

    return (
        <div className="relative aspect-square w-24 rounded-full lg:w-32">
            <div className="relative size-full flex items-center justify-center overflow-hidden rounded-full bg-muted">
                {studentProfilePictureUrl ? (
                    <Image
                        src={studentProfilePictureUrl}
                        alt="student profile picture"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <span className="text-5xl text-muted-foreground">{getInitials(student.name)}</span>
                )}
            </div>

            <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
            />

            <label
                htmlFor="avatar-upload"
                className="absolute right-[4%] bottom-[4%] flex aspect-square w-[25%] cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background transition-opacity hover:opacity-90"
            >
                <Pencil className="size-[45%]" />
            </label>
        </div>
    );
}