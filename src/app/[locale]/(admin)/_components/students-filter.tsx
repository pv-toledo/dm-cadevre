"use client"

import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { studentSearchParams } from "@/lib/nuqs/student-search-params"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { debounce, useQueryState } from 'nuqs'

export default function StudentsFilter() {
    const t = useTranslations("StudentsFilter")

    const [active, setActive] = useQueryState("active", studentSearchParams.active)
    const [query, setQuery] = useQueryState("q", studentSearchParams.q)

    return (
        <div className="flex flex-col gap-4 lg:flex-row">

            <div className="relative w-full lg:max-w-1/2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-10 py-4 placeholder:text-sm lg:placeholder:text-base"
                    placeholder={t("searchInputPlaceholder")}
                    value={query ?? ""}
                    onChange={(e) =>
                        setQuery(e.target.value, {
                            limitUrlUpdates: debounce(300),
                        })
                    }
                />
            </div>
            <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground font-medium">{t("filterLabel")}: </span>
                <Toggle
                    variant="outline"
                    pressed={active}
                    onPressedChange={(pressed) => setActive(pressed)}
                >
                    {t("activeFilter")}
                </Toggle>
            </div>
        </div>
    )
}