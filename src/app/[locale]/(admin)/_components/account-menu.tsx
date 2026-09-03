"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "@/generated/prisma/client";
import { LogOut } from "lucide-react";
import { Locale, useTranslations } from "next-intl";
import { logout } from "../../(auth)/actions";

type AccountMenuProps = {
  userData: UserProfile;
  locale: Locale
};

export default function AccountMenu({ userData, locale }: AccountMenuProps) {
  const t = useTranslations("AccountMenu")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-full border-2 border-primary bg-secondary font-medium text-sidebar-foreground md:size-11">
        {userData.name.slice(0, 1).toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm">{userData.name}</span>
            <span className="text-xs">{userData.role.toLowerCase()}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => logout(locale)}>
          <LogOut className="h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
