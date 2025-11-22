export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-white shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">My Account</h2>
                <nav className="space-y-2">
                    <a href="/profile" className="block py-2 px-4 rounded hover:bg-gray-100">Profile</a>
                    <a href="/orders" className="block py-2 px-4 rounded hover:bg-gray-100">Orders</a>
                    <a href="/billing" className="block py-2 px-4 rounded hover:bg-gray-100">Billing</a>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
