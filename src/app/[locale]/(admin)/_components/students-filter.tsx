"use client"

import { Toggle } from "@/components/ui/toggle"
import { studentSearchParams } from "@/lib/nuqs/student-search-params"
import { useQueryState } from 'nuqs'

export default function StudentsFilter() {
    const [active, setActive] = useQueryState("active", studentSearchParams.active)
    return (
        <div>
            <Toggle variant="outline" pressed={active} onPressedChange={(pressed) => setActive(pressed)}>Active</Toggle>
        </div>
    )
}