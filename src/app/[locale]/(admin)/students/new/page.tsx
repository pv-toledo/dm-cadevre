import { Input } from "@/components/ui/input"
import { getTranslations } from "next-intl/server"
import { DateInput } from "../../_components/date-input"
import { FieldLabel } from "@/components/ui/field"

export default async function NewStudentPage() {
    const t = await getTranslations("NewStudentPage")
    return (
        <div className="flex flex-col gap-10 mt-8 lg:mt-12">
            <h1 className="font-display text-3xl lg:text-4xl">{t("title")}</h1>
            <form className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="name">Nome completo *</FieldLabel>
                    <Input id="name" name="name" className="text-sm lg:text-base" />
                </div>
                <div className="flex gap-5 items-center">
                    <div className="flex flex-col gap-2">
                        <FieldLabel htmlFor="birthDate">Data de nascimento *</FieldLabel>
                        <DateInput id="birthDate" name="birthDate" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <FieldLabel>Idade</FieldLabel>
                        <Input id="age" disabled value={2} />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="responsibleName">Nome do responsável *</FieldLabel>
                    <Input id="responsibleName" name="responsibleName" className="text-sm lg:text-base" />
                </div>
                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="church">Igreja *</FieldLabel>
                    <Input id="chruch" name="church" className="text-sm lg:text-base" />
                </div>
                <div className="flex flex-col gap-2">
                    <FieldLabel htmlFor="address">Endereço *</FieldLabel>
                    <Input id="address" name="address" className="text-sm lg:text-base" />
                </div>
            </form>
        </div>

    )
}