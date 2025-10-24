"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar />
      
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}