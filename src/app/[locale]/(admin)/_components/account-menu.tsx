"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "@/generated/prisma/client";

type AccountMenuProps = {
  userData: UserProfile;
};

export default function AccountMenu({ userData }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">{userData.role}</Button>} />
    </DropdownMenu>
  );
}
