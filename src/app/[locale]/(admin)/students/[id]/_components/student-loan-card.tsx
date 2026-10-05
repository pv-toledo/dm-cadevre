import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentCompleteInfo } from "../../actions";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";

type StudentLoanCardProps = {
    student: StudentCompleteInfo
}

export default async function StudentLoanCard({ student }: StudentLoanCardProps) {

    const t = await getTranslations("StudentLoanCard")

    const studentEnrollments = student.enrollments

    const studentMaintenanceFees = student.enrollments.flatMap(enrollment => enrollment.maintenanceFees)
    console.log(studentMaintenanceFees.length)


    const loanStatusConfig = {
        ACTIVE: {
            label: t("activeStatus"),
            badgeClass: "bg-success/15",
            dotClass: "bg-success",
            textClass: "text-success",
        },

        ENDED: {
            label: t("endedStatus"),
            badgeClass: "bg-muted",
            dotClass: "bg-muted-foreground",
            textClass: "text-muted-foreground",
        },
    } as const;

    const timeZone = (await cookies()).get("timezone")?.value ?? "UTC";
    const locale = await getLocale();

    return (
        <Card className="w-full gap-0 pb-0">
            <CardHeader className="border-b border-muted-foreground/30">
                <CardTitle className="text-base lg:text-lg">Instrumentos emprestados</CardTitle>
            </CardHeader>
            {student.loans.length > 0 && (
                <CardContent className="px-0 gap-3">
                    {student.loans.map(loan => (
                        <div key={loan.id} className="flex flex-col gap-4 border-b border-muted-foreground/30 px-4 py-3 last:border-b-0">
                            <div className="flex items-center justify-between ">
                                <div className="flex flex-col gap-1">
                                    <p className="font-display font-medium text-sm lg:text-base">
                                        {loan.instrument.name}
                                    </p>
                                    <p className="text-xs lg:text-sm text-muted-foreground">
                                        Patrimônio: {loan.instrument.tag}
                                    </p>
                                </div>

                                <div
                                    className={cn(
                                        "flex items-center gap-1 rounded-xl py-1 px-2 w-fit",
                                        loan.returnedAt === null ? loanStatusConfig["ACTIVE"].badgeClass : loanStatusConfig["ENDED"].badgeClass

                                    )}
                                >
                                    <div
                                        className={cn(
                                            "h-2 w-2 rounded-full",
                                            loan.returnedAt === null ? loanStatusConfig["ACTIVE"].dotClass : loanStatusConfig["ENDED"].dotClass,
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            "text-xs font-semibold",
                                            loan.returnedAt === null ? loanStatusConfig["ACTIVE"].textClass : loanStatusConfig["ENDED"].textClass,
                                        )}
                                    >
                                        {loan.returnedAt === null ? loanStatusConfig["ACTIVE"].label : loanStatusConfig["ENDED"].label}
                                    </span>
                                </div>

                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs lg:text-sm text-muted-foreground">Emprestado em</p>
                                    <p className="font-display font-medium text-sm lg:text-base">{loan.loanedAt.toLocaleDateString(locale, { timeZone })}</p>
                                </div>
                                {loan.returnedAt === null ? (
                                    <div>
                                        <p className="text-xs lg:text-sm text-muted-foreground">Retorno esperado</p>
                                        <p className="font-display font-medium text-sm lg:text-base">
                                            {new Date(
                                                new Date(loan.loanedAt).setFullYear(
                                                    new Date(loan.loanedAt).getFullYear() + 1
                                                )
                                            ).toLocaleDateString(locale, { timeZone })}
                                        </p>

                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs lg:text-sm text-muted-foreground">Devolvido em</p>
                                        <p className="font-display font-medium text-sm lg:text-base">{loan.returnedAt.toLocaleDateString(locale, { timeZone })}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between bg-muted/50 px-2 py-4 rounded-xl">
                                <p className="text-xs lg:text-sm text-muted-foreground font-medium">Taxa de manutenção 2026</p>
                                {/* <p className="font-display font-medium text-sm lg:text-base">{studentMaintenanceFees.find()}</p> */}
                            </div>

                        </div>
                    ))}
                </CardContent>
            )}
        </Card>
    )
}