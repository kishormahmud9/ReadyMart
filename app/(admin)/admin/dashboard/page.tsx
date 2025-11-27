"use client"

import { useEffect, useState } from "react"
import { Package, Tag, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Stats {
    products: number
    categories: number
    brands: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, brands: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const [productsRes, categoriesRes, brandsRes] = await Promise.all([
                fetch("/api/admin/products?limit=1"),
                fetch("/api/categories"),
                fetch("/api/brands"),
            ])

            const productsData = await productsRes.json()
            const categoriesData = await categoriesRes.json()
            const brandsData = await brandsRes.json()

            setStats({
                products: productsData.pagination?.totalCount || 0,
                categories: categoriesData.data?.length || 0,
                brands: brandsData.data?.length || 0,
            })
        } catch (error) {
            console.error("Error fetching stats:", error)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            title: "Total Products",
            value: stats.products,
            icon: Package,
            gradient: "from-blue-500 to-blue-600",
            link: "/admin/products/manage",
        },
        {
            title: "Categories",
            value: stats.categories,
            icon: Tag,
            gradient: "from-orange-500 to-orange-600",
            link: "/admin/categories/manage",
        },
        {
            title: "Brands",
            value: stats.brands,
            icon: Award,
            gradient: "from-purple-500 to-purple-600",
            link: "/admin/brands/manage",
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
                    Dashboard Overview
                </h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <Link
                            key={card.title}
                            href={card.link}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                        >
                            <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                                            {card.title}
                                        </p>
                                        {loading ? (
                                            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse mt-2"></div>
                                        ) : (
                                            <p className="text-4xl font-extrabold text-gray-900 mt-2">
                                                {card.value}
                                            </p>
                                        )}
                                    </div>
                                    <div className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={32} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="mr-2 text-orange-500" size={24} />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link
                            href="/admin/products/add"
                            className="block p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
                        >
                            <p className="font-semibold text-gray-900">➕ Add New Product</p>
                            <p className="text-sm text-gray-600 mt-1">Create and publish a new product</p>
                        </Link>
                        <Link
                            href="/admin/categories/manage"
                            className="block p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                        >
                            <p className="font-semibold text-gray-900">🏷️ Manage Categories</p>
                            <p className="text-sm text-gray-600 mt-1">Organize your product categories</p>
                        </Link>
                        <Link
                            href="/admin/brands/manage"
                            className="block p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                        >
                            <p className="font-semibold text-gray-900">🏆 Manage Brands</p>
                            <p className="text-sm text-gray-600 mt-1">Add and edit product brands</p>
                        </Link>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Getting Started</h3>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            <span>Start by creating some categories for your products</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            <span>Add brands to help organize and filter products</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            <span>Create products with detailed information and images</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            <span>Manage orders as they come in from the Orders section</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
