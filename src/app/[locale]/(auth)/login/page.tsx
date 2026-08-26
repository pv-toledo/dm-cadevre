import { useTranslations } from "next-intl";
import LoginForm from "../_components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{t("CardTitle")}</CardTitle>
        <CardDescription>{t("CardDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <LoginForm/>
      </CardContent>
    </Card>
  );
}
