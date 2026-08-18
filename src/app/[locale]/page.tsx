import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage")
  return (
    <div>
      <main>
        <p>{t("title")}</p>
      </main>
    </div>
  );
}
