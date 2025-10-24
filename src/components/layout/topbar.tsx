"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Avatar>
            <AvatarImage src="https://i.ibb.co.com/99p5gwxp/IMG-20250817-173712.jpg" alt="User" />
          </Avatar>
        </div>
      </div>
    </div>
  )
}