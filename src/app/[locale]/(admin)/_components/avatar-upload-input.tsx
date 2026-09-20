"use client"

import { Plus, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";
import { convertToWebp } from "@/lib/image";
import { uploadImage } from "../students/actions";

type AvatarUploadInputProps = {

studentNameInitials: string | null

}

export function AvatarUploadInput({studentNameInitials}: AvatarUploadInputProps) {

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    const webpFile = await convertToWebp(file)

    await uploadImage(webpFile)

  }

  return (
    <div className="relative aspect-square w-36 rounded-full md:w-48 lg:w-64">
      <div className="flex size-full items-center justify-center rounded-full bg-muted">
        {/* <p className="text-3xl text-muted-foreground md:text-5xl lg:text-6xl">
          {studentNameInitials === "UNDEFINEDUNDEFINED" ? "DM" : studentNameInitials}
        </p> */}
        <User strokeWidth={4} nonScalingStroke className="size-18 md:size-24 lg:size-28 text-muted-foreground"/>
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