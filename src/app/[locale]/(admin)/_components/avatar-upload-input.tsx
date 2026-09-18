"use client"

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "@/components/ui/toast";
import { convertToWebp } from "@/lib/image";

type AvatarUploadInputProps = {
  onUpload?: (path:string) => void
}

export function AvatarUploadInput({onUpload}: AvatarUploadInputProps) {

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    const webpFile = await convertToWebp(file)

    toast.add({
      type: "success",
      description: webpFile.name
    })
  }

  return (
    <div className="relative aspect-square w-36 rounded-full md:w-48 lg:w-64">
      <div className="flex size-full items-center justify-center rounded-full bg-muted">
        <p className="text-3xl text-muted-foreground md:text-5xl lg:text-6xl">
          AS
        </p>
      </div>

      <Input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      <label
        htmlFor="avatar-upload"
        className="absolute right-[8%] bottom-[8%] flex aspect-square w-[18%] cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background transition-opacity hover:opacity-90"
      >
        <Plus className="size-[45%]" />
      </label>
    </div>
  );
}