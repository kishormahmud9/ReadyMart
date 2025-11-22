export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Product Details</h1>
            <p>Product ID: {params.slug}</p>
        </div>
    );
}
