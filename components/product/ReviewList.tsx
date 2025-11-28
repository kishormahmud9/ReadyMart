"use client"

import { Star } from "lucide-react"

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

interface ReviewListProps {
    reviews: Review[]
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
            ))}
        </div>
    )
}

export default function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </div>
        )
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-gray-900">
                        {averageRating.toFixed(1)}
                    </div>
                    <div>
                        <StarRating rating={Math.round(averageRating)} />
                        <p className="text-sm text-gray-600 mt-1">
                            Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {review.user.name || "Anonymous"}
                                </p>
                                <StarRating rating={review.rating} />
                            </div>
                            <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        {review.comment && (
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
