"use client"

import { format, isValid, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
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
import { useState } from "react"

function maskDate(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function parseDate(text: string) {
  if (text.length !== 10) return undefined
  const date = parse(text, "dd/MM/yyyy", new Date())
  return isValid(date) ? date : undefined
}

export function DateInput({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [month, setMonth] = useState<Date>()

  const date = parseDate(text)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <InputGroup>
          <InputGroupInput
            id={id}
            value={text}
            placeholder="dd/mm/aaaa"
            inputMode="numeric"
            autoComplete="off"
            onChange={(e) => {
              const next = maskDate(e.target.value)
              setText(next)
              const parsed = parseDate(next)
              if (parsed) setMonth(parsed)
            }}
          />
          <InputGroupAddon align="inline-end">
            <PopoverTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                >
                  <CalendarIcon />
                </InputGroupButton>
              }
            />
          </InputGroupAddon>
        </InputGroup>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            required
            selected={date}
            month={month}
            onMonthChange={setMonth}
            captionLayout="dropdown-years"
            onSelect={(selected) => {
              setText(format(selected, "dd/MM/yyyy"))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      <input
        type="hidden"
        name={name}
        value={date ? format(date, "yyyy-MM-dd") : ""}
      />
    </>
  )
}