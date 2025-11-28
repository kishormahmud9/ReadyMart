"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import ImageGallery from "@/components/product/ImageGallery"
import ProductInfo from "@/components/product/ProductInfo"
import QuantitySelector from "@/components/product/QuantitySelector"
import AddToCartButton from "@/components/product/AddToCartButton"
import RelatedProducts from "@/components/product/RelatedProducts"
import ReviewList from "@/components/product/ReviewList"
import ReviewForm from "@/components/product/ReviewForm"

interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: string
    salePrice: string | null
    images: string[]
    stock: number
    categoryId: string
    category: {
        name: string
    }
    brand: {
        name: string
    } | null
}

interface Review {
    id: string
    rating: number
    comment: string | null
    createdAt: string
    user: {
        name: string | null
        email: string
    }
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params?.slug as string

    const [product, setProduct] = useState<Product | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        if (slug) {
            fetchProduct()
        }
    }, [slug])

    const fetchProduct = async () => {
        try {
            // Fetch product by slug
            const productRes = await fetch(`/api/products?slug=${slug}`)
            const productData = await productRes.json()

            if (productData.success && productData.data.length > 0) {
                const fetchedProduct = productData.data[0]
                setProduct(fetchedProduct)

                // Fetch reviews
                const reviewsRes = await fetch(`/api/products/${fetchedProduct.id}/reviews`)
                const reviewsData = await reviewsRes.json()
                if (reviewsData.success) {
                    setReviews(reviewsData.data || [])
                }
            } else {
                // Product not found
                router.push("/shop")
            }
        } catch (error) {
            console.error("Error fetching product:", error)
            router.push("/shop")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
                        <div className="space-y-4">
                            <div className="w-full aspect-square bg-gray-200 rounded-2xl" />
                            <div className="grid grid-cols-4 gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-10 bg-gray-200 rounded w-3/4" />
                            <div className="h-8 bg-gray-200 rounded w-1/4" />
                            <div className="h-20 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Shop</span>
                </Link>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Image Gallery */}
                    <ImageGallery images={product.images} productName={product.name} />

                    {/* Right: Product Info */}
                    <div className="space-y-8">
                        <ProductInfo
                            name={product.name}
                            price={product.price}
                            salePrice={product.salePrice}
                            description={product.description}
                            stock={product.stock}
                            category={product.category}
                            brand={product.brand}
                        />

                        {/* Actions */}
                        {product.stock > 0 && (
                            <div className="space-y-4 border-t border-gray-200 pt-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-3">
                                        Quantity
                                    </label>
                                    <QuantitySelector
                                        min={1}
                                        max={product.stock}
                                        value={quantity}
                                        onChange={setQuantity}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <AddToCartButton
                                            productId={product.id}
                                            productName={product.name}
                                            quantity={quantity}
                                            stock={product.stock}
                                        />
                                    </div>
                                    <button
                                        className="w-14 h-14 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:border-orange-600 hover:text-orange-600 transition-colors"
                                        aria-label="Add to wishlist"
                                    >
                                        <Heart size={24} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {product.stock === 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                <p className="text-red-600 font-semibold text-lg">
                                    This product is currently out of stock
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1">
                            <ReviewForm
                                productId={product.id}
                                onReviewSubmitted={() => {
                                    // Refresh reviews
                                    fetch(`/api/products/${product.id}/reviews`)
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.success) setReviews(data.data)
                                        })
                                }}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <ReviewList reviews={reviews} />
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
            </div>
        </div>
    )
}
