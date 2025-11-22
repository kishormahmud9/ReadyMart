export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-gray-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-6">Admin</h2>
                <nav className="space-y-2">
                    <a href="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-gray-800">Dashboard</a>
                    <a href="/admin/products" className="block py-2 px-4 rounded hover:bg-gray-800">Products</a>
                    <a href="/admin/orders" className="block py-2 px-4 rounded hover:bg-gray-800">Orders</a>
                    <a href="/admin/ui/banners" className="block py-2 px-4 rounded hover:bg-gray-800">UI Management</a>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
