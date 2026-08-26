import { useTranslations } from "next-intl";
import SignOutButton from "../(auth)/_components/signout-button";

export default function Home() {
  const t = useTranslations("HomePage")
  return (
    <div>
      <main>
        <p>{t("title")}</p>
        <SignOutButton />
      </main>
    </div>
  );
}
