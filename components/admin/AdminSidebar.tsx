"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Tag,
    Award,
    Users,
    Settings,
    BarChart3,
    Image as ImageIcon,
    LogOut,
} from "lucide-react"

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products/manage", icon: Package },
    { name: "Categories", href: "/admin/categories/manage", icon: Tag },
    { name: "Brands", href: "/admin/brands/manage", icon: Award },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics/traffic", icon: BarChart3 },
    { name: "UI/Banners", href: "/admin/ui/banners", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white flex flex-col shadow-2xl">
            {/* Logo */}
            <div className="p-6 border-b border-blue-700/50">
                <Link href="/admin/dashboard" className="block">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-400">
                        Ready<span className="text-orange-400">Mart</span>
                    </h2>
                    <p className="text-xs text-blue-300 mt-1 tracking-wider uppercase">Admin Panel</p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                                ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50 scale-105"
                                    : "text-blue-100 hover:bg-blue-800/50 hover:text-white hover:translate-x-1"
                                }
                            `}
                        >
                            <Icon size={20} className={isActive ? "text-white" : "text-blue-300"} />
                            <span>{item.name}</span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-blue-700/50">
                <button className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-blue-100 hover:bg-red-600 hover:text-white transition-all duration-200 w-full">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}
