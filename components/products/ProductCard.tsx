import Link from "next/link";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    category: string;
}

export default function ProductCard({ id, name, price, salePrice, image, category }: ProductCardProps) {
    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
            {/* Badges */}
            {salePrice && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                    SALE
                </span>
            )}
            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:text-red-500 cursor-pointer">
                <Heart size={18} />
            </span>

            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <button className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <ShoppingCart size={20} />
                    </button>
                    <Link href={`/product/${id}`} className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75">
                        <Eye size={20} />
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{category}</p>
                <Link href={`/product/${id}`}>
                    <h3 className="font-bold text-gray-800 text-lg mb-2 truncate group-hover:text-blue-600 transition-colors">{name}</h3>
                </Link>
                <div className="flex items-center space-x-2">
                    {salePrice ? (
                        <>
                            <span className="text-xl font-bold text-orange-600">${salePrice}</span>
                            <span className="text-sm text-gray-400 line-through">${price}</span>
                        </>
                    ) : (
                        <span className="text-xl font-bold text-gray-900">${price}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
