import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations("LoginPage")
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground sm:top-6 sm:left-6"
      >
        <ArrowLeft className="size-4" />
        {t("HomeButton")}
      </Link>
      {children}
    </main>
  );
}