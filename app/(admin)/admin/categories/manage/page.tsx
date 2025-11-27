"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Search, X } from "lucide-react"
import toast from "react-hot-toast"

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    image: string | null
    createdAt: string
    _count?: {
        products: number
    }
}

export default function CategoriesManagePage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({ name: "", slug: "", description: "", image: "" })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories")
            const data = await res.json()
            if (data.success) {
                setCategories(data.data)
            }
        } catch (error) {
            toast.error("Failed to load categories")
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setEditingCategory(null)
        setFormData({ name: "", slug: "", description: "", image: "" })
        setShowModal(true)
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            image: category.image || "",
        })
        setShowModal(true)
    }

    const handleDelete = async (category: Category) => {
        if (category._count && category._count.products > 0) {
            toast.error(`Cannot delete category with ${category._count.products} products`)
            return
        }

        if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return

        try {
            const res = await fetch(`/api/categories/${category.id}`, { method: "DELETE" })
            const data = await res.json()

            if (data.success) {
                toast.success("Category deleted successfully")
                setCategories(categories.filter((c) => c.id !== category.id))
            } else {
                toast.error(data.error || "Failed to delete category")
            }
        } catch (error) {
            toast.error("Failed to delete category")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories"
            const method = editingCategory ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (data.success) {
                toast.success(data.message || `Category ${editingCategory ? "updated" : "created"} successfully`)
                setShowModal(false)
                fetchCategories()
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

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
                        Categories
                    </h1>
                    <p className="text-gray-600 mt-2">Manage product categories</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                >
                    <Plus size={20} />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search categories..."
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
                ) : filteredCategories.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {searchTerm ? "No categories found" : "No categories yet. Create one to get started!"}
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
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {category.image ? (
                                                <img src={category.image} alt={category.name} className="w-10 h-10 rounded-lg object-cover mr-3" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg mr-3"></div>
                                            )}
                                            <span className="font-semibold text-gray-900">{category.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {category._count?.products || 0} products
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingCategory ? "Edit Category" : "Add Category"}
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
                                    placeholder="e.g., Electronics"
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
                                    placeholder="e.g., electronics"
                                />
                                <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Optional description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
                                    {submitting ? "Saving..." : editingCategory ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
