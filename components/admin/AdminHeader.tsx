"use client"

import { Bell, Search, User } from "lucide-react"

export default function AdminHeader() {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
            <div className="flex items-center justify-between px-8 py-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products, orders, customers..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-4 ml-6">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200">
                        <Bell size={22} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                            A
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500">admin@readymart.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
