"use client"

import { Plus, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "@/components/ui/toast";

const notSupportedTypes = [
  "HEIC",
  "HEIF"
]

type AvatarUploadInputProps = {
  onChange: (file?: File) => void
}

export function AvatarUploadInput({onChange}: AvatarUploadInputProps) {

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    const extension = file.name.split(".").pop()?.toUpperCase()

    if (extension && notSupportedTypes.includes(extension)) {
      toast.add({
        type: "error",
        description: `${extension} files are no supported`
      })

      return
    }

    onChange(file)

    setAvatarUrl(URL.createObjectURL(file))
  }

  return (
    <div className="relative aspect-square w-36 rounded-full md:w-48 lg:w-64">
      <div className="relative size-full flex items-center justify-center overflow-hidden rounded-full bg-muted">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="student profile picture"
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <User strokeWidth={4} nonScalingStroke className="size-18 md:size-24 lg:size-28 text-muted-foreground" />
        )}
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