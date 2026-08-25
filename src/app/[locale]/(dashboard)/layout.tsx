import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</div>
    )
}