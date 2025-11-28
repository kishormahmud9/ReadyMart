"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import FilterSidebar from "@/components/shop/FilterSidebar"
import SortDropdown from "@/components/shop/SortDropdown"
import ProductGrid from "@/components/shop/ProductGrid"
import Pagination from "@/components/shop/Pagination"

interface Product {
    id: string
    name: string
    slug: string
    price: string
    salePrice: string | null
    images: string[]
    stock: number
    brand: { name: string } | null
    category: { name: string }
}

interface Category {
    id: string
    name: string
}

interface Brand {
    id: string
    name: string
}

export default function ShopPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(1)

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
    const [sortBy, setSortBy] = useState("latest")
    const [currentPage, setCurrentPage] = useState(1)

    // Fetch categories and brands on mount
    useEffect(() => {
        fetchFilters()
    }, [])

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts()
    }, [selectedCategories, selectedBrands, priceRange, sortBy, currentPage])

    const fetchFilters = async () => {
        try {
            const [categoriesRes, brandsRes] = await Promise.all([
                fetch("/api/categories"),
                fetch("/api/brands"),
            ])

            const categoriesData = await categoriesRes.json()
            const brandsData = await brandsRes.json()

            if (categoriesData.success) setCategories(categoriesData.data)
            if (brandsData.success) setBrands(brandsData.data)
        } catch (error) {
            console.error("Error fetching filters:", error)
        }
    }

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            if (selectedCategories.length > 0) {
                params.append("categoryId", selectedCategories.join(","))
            }
            if (selectedBrands.length > 0) {
                params.append("brandId", selectedBrands.join(","))
            }
            if (priceRange[0] > 0) {
                params.append("minPrice", priceRange[0].toString())
            }
            if (priceRange[1] < 10000) {
                params.append("maxPrice", priceRange[1].toString())
            }

            // Sorting
            if (sortBy === "price-asc") {
                params.append("sortBy", "price")
                params.append("sortOrder", "asc")
            } else if (sortBy === "price-desc") {
                params.append("sortBy", "price")
                params.append("sortOrder", "desc")
            } else if (sortBy === "name-asc") {
                params.append("sortBy", "name")
                params.append("sortOrder", "asc")
            } else if (sortBy === "name-desc") {
                params.append("sortBy", "name")
                params.append("sortOrder", "desc")
            } else {
                params.append("sortBy", "createdAt")
                params.append("sortOrder", "desc")
            }

            params.append("page", currentPage.toString())
            params.append("limit", "12")

            const response = await fetch(`/api/products?${params.toString()}`)
            const data = await response.json()

            if (data.success) {
                setProducts(data.data)
                setTotalPages(data.pagination?.totalPages || 1)
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleClearFilters = () => {
        setSelectedCategories([])
        setSelectedBrands([])
        setPriceRange([0, 10000])
        setSortBy("latest")
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 mb-2">
                        Shop
                    </h1>
                    <p className="text-gray-600">
                        Discover our amazing collection of products
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Sidebar - Filters */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <FilterSidebar
                            categories={categories}
                            brands={brands}
                            selectedCategories={selectedCategories}
                            selectedBrands={selectedBrands}
                            minPrice={0}
                            maxPrice={10000}
                            priceRange={priceRange}
                            onCategoryChange={setSelectedCategories}
                            onBrandChange={setSelectedBrands}
                            onPriceChange={setPriceRange}
                            onClearFilters={handleClearFilters}
                        />
                    </aside>

                    {/* Products Section */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                {loading ? "Loading..." : `${products.length} products found`}
                            </p>
                            <SortDropdown value={sortBy} onChange={setSortBy} />
                        </div>

                        {/* Product Grid */}
                        <ProductGrid products={products} loading={loading} />

                        {/* Pagination */}
                        {!loading && products.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
