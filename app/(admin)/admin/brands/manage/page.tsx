"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Search, X } from "lucide-react"
import toast from "react-hot-toast"

interface Brand {
    id: string
    name: string
    slug: string
    logo: string | null
    createdAt: string
    _count?: {
        products: number
    }
}

export default function BrandsManagePage() {
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
    const [formData, setFormData] = useState({ name: "", slug: "", logo: "" })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchBrands()
    }, [])

    const fetchBrands = async () => {
        try {
            const res = await fetch("/api/brands")
            const data = await res.json()
            if (data.success) {
                setBrands(data.data)
            }
        } catch (error) {
            toast.error("Failed to load brands")
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setEditingBrand(null)
        setFormData({ name: "", slug: "", logo: "" })
        setShowModal(true)
    }

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand)
        setFormData({
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo || "",
        })
        setShowModal(true)
    }

    const handleDelete = async (brand: Brand) => {
        if (brand._count && brand._count.products > 0) {
            toast.error(`Cannot delete brand with ${brand._count.products} products`)
            return
        }

        if (!confirm(`Are you sure you want to delete "${brand.name}"?`)) return

        try {
            const res = await fetch(`/api/brands/${brand.id}`, { method: "DELETE" })
            const data = await res.json()

            if (data.success) {
                toast.success("Brand deleted successfully")
                setBrands(brands.filter((b) => b.id !== brand.id))
            } else {
                toast.error(data.error || "Failed to delete brand")
            }
        } catch (error) {
            toast.error("Failed to delete brand")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const url = editingBrand ? `/api/brands/${editingBrand.id}` : "/api/brands"
            const method = editingBrand ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (data.success) {
                toast.success(data.message || `Brand ${editingBrand ? "updated" : "created"} successfully`)
                setShowModal(false)
                fetchBrands()
            } else {
                toast.error(data.error || "Operation failed")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    const handleNameChange = (name: string) => {
        setFormData({ ...formData, name, slug: name.toLowerCase().replace(/\s+/g, "-") })
    }

    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
                        Brands
                    </h1>
                    <p className="text-gray-600 mt-2">Manage product brands</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                >
                    <Plus size={20} />
                    <span>Add Brand</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredBrands.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {searchTerm ? "No brands found" : "No brands yet. Create one to get started!"}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Products
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredBrands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {brand.logo ? (
                                                <img src={brand.logo} alt={brand.name} className="w-10 h-10 rounded-lg object-cover mr-3" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mr-3 flex items-center justify-center text-white font-bold text-sm">
                                                    {brand.name[0]}
                                                </div>
                                            )}
                                            <span className="font-semibold text-gray-900">{brand.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{brand.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                            {brand._count?.products || 0} products
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(brand.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(brand)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(brand)}
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
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingBrand ? "Edit Brand" : "Add Brand"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="e.g., Nike"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="e.g., nike"
                                />
                                <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo URL</label>
                                <input
                                    type="url"
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : editingBrand ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
