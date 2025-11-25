import ProductCard from "../products/ProductCard";

const products = [
    {
        id: 1,
        name: "Classic Denim Jacket",
        price: 49.99,
        salePrice: 79.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80",
        category: "Men",
    },
    {
        id: 2,
        name: "Floral Summer Dress",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80",
        category: "Women",
    },
    {
        id: 3,
        name: "Kids Cotton T-Shirt",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500&auto=format&fit=crop&q=80",
        category: "Kids",
    },
    {
        id: 4,
        name: "Leather Crossbody Bag",
        price: 89.99,
        salePrice: 120.0,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=80",
        category: "Accessories",
    },
];

export default function ProductSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-blue-900 mb-2">
                            Featured Products
                        </h2>
                        <p className="text-gray-600">Handpicked for your style.</p>
                    </div>
                    <a
                        href="/shop"
                        className="text-orange-500 font-semibold hover:text-orange-600 transition"
                    >
                        View All &rarr;
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
