import { getTranslations } from "next-intl/server";
import NewStudentForm from "../../_components/new-student-form";
import { AvatarUploadInput } from "../../_components/avatar-upload-input";


export default async function NewStudentPage() {
    const t = await getTranslations("NewStudentPage")
    return (
        <div className="flex flex-col gap-10 mt-8 lg:mt-12">
            <h1 className="font-display text-3xl lg:text-4xl">{t("title")}</h1>
            <div className="grid grid-cols-1 items-center gap-8 lg:gap-12 lg:grid-cols-[2fr_1fr]">
                <div className="min-w-3/4 order-2 lg:order-1">
                    <NewStudentForm />
                </div>

                <div className="flex h-full w-full items-start justify-center order-1 lg:order-2">
                    <AvatarUploadInput />
                </div>

            </div>
        </div>

    )
}