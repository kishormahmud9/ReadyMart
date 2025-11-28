import { Tag, Award, Package } from "lucide-react"

interface ProductInfoProps {
    name: string
    price: string
    salePrice: string | null
    description: string
    stock: number
    category: { name: string }
    brand: { name: string } | null
}

export default function ProductInfo({
    name,
    price,
    salePrice,
    description,
    stock,
    category,
    brand,
}: ProductInfoProps) {
    const currentPrice = salePrice || price
    const hasDiscount = !!salePrice
    const discountPercentage = hasDiscount
        ? Math.round(((parseFloat(price) - parseFloat(salePrice)) / parseFloat(price)) * 100)
        : 0

    const inStock = stock > 0

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>

                {/* Category & Brand */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Tag size={16} />
                        <span>{category.name}</span>
                    </div>
                    {brand && (
                        <div className="flex items-center gap-1">
                            <Award size={16} />
                            <span>{brand.name}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-orange-600">
                    ${parseFloat(currentPrice).toFixed(2)}
                </div>
                {hasDiscount && (
                    <>
                        <div className="text-2xl font-medium text-gray-400 line-through">
                            ${parseFloat(price).toFixed(2)}
                        </div>
                        <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                            {discountPercentage}% OFF
                        </div>
                    </>
                )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
                <Package size={20} className={inStock ? "text-green-600" : "text-red-600"} />
                <span className={`font-medium ${inStock ? "text-green-600" : "text-red-600"}`}>
                    {inStock ? `In Stock (${stock} available)` : "Out of Stock"}
                </span>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            </div>
        </div>
    )
}
