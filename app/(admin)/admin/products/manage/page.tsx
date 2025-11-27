"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

interface Product {
    id: string
    name: string
    slug: string
    price: number
    salePrice: number | null
    stock: number
    images: string[]
    isArchived: boolean
    category: {
        id: string
        name: string
    }
    brand: {
        id: string
        name: string
    } | null
}

interface Category {
    id: string
    name: string
}

interface Brand {
    id: string
    name: string
}

export default function ProductsManagePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("")
    const [brandFilter, setBrandFilter] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        fetchFilters()
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [search, categoryFilter, brandFilter, page])

    const fetchFilters = async () => {
        try {
            const [catRes, brandRes] = await Promise.all([
                fetch("/api/categories"),
                fetch("/api/brands"),
            ])

            const catData = await catRes.json()
            const brandData = await brandRes.json()

            if (catData.success) setCategories(catData.data)
            if (brandData.success) setBrands(brandData.data)
        } catch (error) {
            console.error("Error fetching filters:", error)
        }
    }

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "20",
            })

            if (search) params.append("search", search)
            if (categoryFilter) params.append("category", categoryFilter)
            if (brandFilter) params.append("brand", brandFilter)

            const res = await fetch(`/api/admin/products?${params}`)
            const data = await res.json()

            if (data.success) {
                setProducts(data.data)
                setTotalPages(data.pagination.totalPages)
                setTotalCount(data.pagination.totalCount)
            }
        } catch (error) {
            toast.error("Failed to load products")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (product: Product) => {
        if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return

        try {
            const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" })
            const data = await res.json()

            if (data.success) {
                toast.success("Product deleted successfully")
                fetchProducts()
            } else {
                toast.error(data.error || "Failed to delete product")
            }
        } catch (error) {
            toast.error("Failed to delete product")
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
                        Products
                    </h1>
                    <p className="text-gray-600 mt-2">Manage your product catalog ({totalCount} total)</p>
                </div>
                <Link
                    href="/admin/products/add"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search by name..."
                                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                        <select
                            value={brandFilter}
                            onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">All Brands</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No products found. Create your first product to get started!
                    </div>
                ) : (
                    <>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Brand
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {product.images && product.images[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover mr-3"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center text-gray-400">
                                                        No img
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-500">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                {product.category.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {product.brand?.name || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                {product.salePrice ? (
                                                    <>
                                                        <p className="font-bold text-orange-600">${product.salePrice}</p>
                                                        <p className="text-sm text-gray-400 line-through">${product.price}</p>
                                                    </>
                                                ) : (
                                                    <p className="font-bold text-gray-900">${product.price}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 20
                                                ? "bg-green-100 text-green-700"
                                                : product.stock > 0
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.isArchived
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                                }`}>
                                                {product.isArchived ? "Archived" : "Active"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
