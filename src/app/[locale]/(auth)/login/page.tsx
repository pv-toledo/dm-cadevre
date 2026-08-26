import LoginForm from "../_components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveSafeRedirect } from "@/lib/safe-redirect";
import { getLocale, getTranslations } from "next-intl/server";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string
  }>
}

export default async function LoginPage({searchParams}: LoginPageProps) {
  const params = await searchParams
  const nextPage = resolveSafeRedirect(params.next, "/")
  const locale = await getLocale()
  const t = await getTranslations("LoginPage");
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{t("CardTitle")}</CardTitle>
        <CardDescription>{t("CardDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <LoginForm nextPage={nextPage} locale={locale}/>
      </CardContent>
    </Card>
  );
}
