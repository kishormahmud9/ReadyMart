export default function OrderTrackingPage() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
            <input type="text" placeholder="Enter Order ID" className="border p-2 rounded" />
            <button className="bg-black text-white p-2 rounded ml-2">Track</button>
        </div>
    );
}
