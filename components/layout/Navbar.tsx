import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar() {
    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-orange-100">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white text-xs py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <p className="font-medium tracking-wide">✨ Welcome to ReadyMart - Your Premium Fashion Destination</p>
                    <div className="flex space-x-6">
                        <Link href="/track-order" className="hover:text-orange-300 transition duration-300">Track Order</Link>
                        <Link href="/about" className="hover:text-orange-300 transition duration-300">About Us</Link>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 hover:from-orange-500 hover:to-orange-600 transition duration-500">
                        Ready<span className="text-orange-500">Mart</span>
                    </Link>

                    {/* Search Bar (Hidden on mobile) */}
                    <div className="hidden md:flex flex-1 mx-12 max-w-2xl relative group justify-center">
                        <SearchBar />
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-6 text-gray-700">
                        <Link href="/cart" className="relative group hover:text-orange-500 transition duration-300">
                            <div className="p-2 rounded-full group-hover:bg-orange-50 transition duration-300">
                                <ShoppingCart size={26} />
                            </div>
                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                                0
                            </span>
                        </Link>
                        <Link href="/login" className="group hover:text-orange-500 transition duration-300">
                            <div className="p-2 rounded-full group-hover:bg-orange-50 transition duration-300">
                                <User size={26} />
                            </div>
                        </Link>
                        <button className="md:hidden hover:text-orange-500 transition">
                            <Menu size={26} />
                        </button>
                    </div>
                </div>

                {/* Mobile Search (Visible on mobile) */}
                <div className="md:hidden mt-4 relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-orange-500 focus:shadow-md transition duration-300"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* Categories Bar */}
            <div className="bg-white border-t border-gray-100 hidden md:block shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center space-x-10 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        <Link href="/shop" className="hover:text-orange-500 hover:scale-105 transition duration-300">All Categories</Link>
                        <Link href="/shop?category=men" className="hover:text-orange-500 hover:scale-105 transition duration-300">Men</Link>
                        <Link href="/shop?category=women" className="hover:text-orange-500 hover:scale-105 transition duration-300">Women</Link>
                        <Link href="/shop?category=kids" className="hover:text-orange-500 hover:scale-105 transition duration-300">Kids</Link>
                        <Link href="/shop?category=accessories" className="hover:text-orange-500 hover:scale-105 transition duration-300">Accessories</Link>
                        <Link href="/shop?category=sale" className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 font-bold hover:scale-110 transition duration-300">Flash Sale 🔥</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
