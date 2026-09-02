"use client";

import { Button } from "@/components/ui/button";
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
import { ChevronDown } from "lucide-react";

type AccountMenuProps = {
  userData: UserProfile;
};

export default function AccountMenu({ userData }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-medium text-muted-foreground">
        {userData.name.slice(0, 1).toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span>{userData.name}</span>
            <span>Perfil: {userData.role.toLowerCase()}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
            <button>sair</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
