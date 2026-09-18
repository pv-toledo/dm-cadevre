import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AvatarUploadInput() {
  return (
    <div className="relative aspect-square w-36 rounded-full md:w-48 lg:w-64">
      <div className="flex size-full items-center justify-center rounded-full bg-muted ">
        <p className="text-3xl text-muted-foreground md:text-5xl lg:text-6xl">AS</p>
      </div>

      <Input
        type="file"
        accept="image/*"
        className="peer absolute right-[3%] bottom-[3%] z-10 aspect-square w-[28%] cursor-pointer rounded-full opacity-0"
      />

      <span className="pointer-events-none absolute right-[8%] bottom-[8%] z-0 flex aspect-square w-[18%] items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
        <Plus className="size-[45%]" />
      </span>
    </div>
  );
}