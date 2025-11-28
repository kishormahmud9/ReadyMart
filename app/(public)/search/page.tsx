"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import ProductGrid from "@/components/shop/ProductGrid"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (query) {
            fetchResults()
        } else {
            setLoading(false)
        }
    }, [query])

    const fetchResults = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`)
            const data = await response.json()
            if (data.success) {
                setProducts(data.data)
            }
        } catch (error) {
            console.error("Search failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Search Results
                    </h1>
                    <p className="text-gray-600">
                        {query
                            ? `Showing results for "${query}"`
                            : "Enter a search term to find products"
                        }
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-orange-600" size={40} />
                    </div>
                ) : products.length > 0 ? (
                    <ProductGrid products={products} loading={false} />
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Search size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No results found</h2>
                        <p className="text-gray-600 mb-8">
                            We couldn't find any products matching "{query}".
                        </p>
                        <a
                            href="/shop"
                            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                        >
                            Browse All Products
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
