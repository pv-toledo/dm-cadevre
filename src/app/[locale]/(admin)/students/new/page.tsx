import { getTranslations } from "next-intl/server";
import NewStudentForm from "../../_components/new-student-form";

export default async function NewStudentPage() {
    const t = await getTranslations("NewStudentPage")
    return (
        <div className="flex flex-col gap-10 mt-8 lg:mt-12">
            <h1 className="font-display text-3xl lg:text-4xl">{t("title")}</h1>
            <NewStudentForm />
        </div>

    )
}