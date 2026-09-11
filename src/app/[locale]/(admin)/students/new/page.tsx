// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { getTranslations } from "next-intl/server"

// export default async function NewStudentPage() {
//     const t = await getTranslations("NewStudentPage")
//     return (
//         <div className="flex flex-col gap-10 mt-8 lg:mt-12">
//             <h1 className="font-display text-3xl lg:text-4xl">{t("title")}</h1>
//             <form className="flex flex-col gap-3">
//                 <div className="flex flex-col gap-2">
//                     <Label>Nome completo *</Label>
//                     <Input id="name" className="text-sm lg:text-base" />
//                 </div>

//             </form>
//         </div>

//     )


// }

"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateInput } from "../../_components/date-input"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export default function NewStudentPage() {

  return (
    <Field>
      <FieldLabel htmlFor="birthDate">Birth date</FieldLabel>
      <DateInput id="birthDate" name="birthDate" />
    </Field>
  )
}
