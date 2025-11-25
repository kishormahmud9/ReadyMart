import Link from "next/link";
import Image from "next/image";

const categories = [
    { id: 1, name: "Men", image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500&auto=format&fit=crop&q=80", link: "/shop?category=men", color: "from-blue-500 to-blue-700" },
    { id: 2, name: "Women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80", link: "/shop?category=women", color: "from-pink-500 to-rose-600" },
    { id: 3, name: "Kids", image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500&auto=format&fit=crop&q=80", link: "/shop?category=kids", color: "from-yellow-400 to-orange-500" },
    { id: 4, name: "Accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&auto=format&fit=crop&q=80", link: "/shop?category=accessories", color: "from-purple-500 to-indigo-600" },
];

export default function CategorySection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900 tracking-tight">
                    Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Category</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {categories.map((category) => (
                        <Link key={category.id} href={category.link} className="group relative block h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-40 transition-opacity duration-500`}></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6">
                                <h3 className="text-3xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{category.name}</h3>
                                <span className="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 flex items-center">
                                    Explore Collection &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
