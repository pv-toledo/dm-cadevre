import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function StudentCard() {
    const t = await getTranslations("StudentCard")
    return (
        <Card className="py-4 border-l-4 border-l-red-600">
            <CardContent className="flex flex-row gap-3 items-center ">
                <Avatar size="lg">
                    <AvatarFallback>PV</AvatarFallback>
                    <AvatarBadge className="bg-green-600" />
                </Avatar>
                <div className="flex flex-col justify-between">
                    <p>Paulo Vinícius</p>
                    <div className="flex gap-1">
                        <Badge variant="destructive">{t("overdueStatus")}</Badge>
                        <span>28 anos</span>
                        <span>•</span>
                        <span>(24) 992944741</span>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}