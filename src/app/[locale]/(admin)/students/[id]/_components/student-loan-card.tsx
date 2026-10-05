import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentCompleteInfo } from "../../actions";

type StudentLoanCardProps = {
    student: StudentCompleteInfo
}

export default async function StudentLoanCard ({student}: StudentLoanCardProps) {
    console.log(student)

    return (
        <Card className="w-full gap-0 pb-0">
            <CardHeader>
                <CardTitle className="text-base lg:text-lg">Instrumentos emprestados</CardTitle>
            </CardHeader>
            <CardContent>
                
            </CardContent>
        </Card>
    )
}