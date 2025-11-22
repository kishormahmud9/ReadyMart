export default function UserOrdersPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            <div className="flex space-x-4 border-b mb-4">
                <button className="py-2 px-4 border-b-2 border-black font-bold">All</button>
                <button className="py-2 px-4 text-gray-500">Pending</button>
                <button className="py-2 px-4 text-gray-500">Completed</button>
                <button className="py-2 px-4 text-gray-500">Cancelled</button>
            </div>
            <p>Order list will appear here.</p>
        </div>
    );
}
