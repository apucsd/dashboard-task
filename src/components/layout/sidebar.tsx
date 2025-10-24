"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart
  }
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="hidden border-r bg-background h-screen md:flex md:w-64 md:flex-col">
      <div className="flex flex-col space-y-6 p-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-2xl">Dashboard</span>
        </Link>
        
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}