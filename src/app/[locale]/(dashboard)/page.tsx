import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage")
  return (
    <div>
      <main>
        <p>{t("title")}</p>
        <button className="bg-primary text-primary-foreground">Salvar</button>
      </main>
    </div>
  );
}
