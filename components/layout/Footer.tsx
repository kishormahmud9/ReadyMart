import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <Link href="/" className="text-3xl font-bold mb-6 block">
                            Ready<span className="text-orange-500">Mart</span>
                        </Link>
                        <p className="text-blue-200 mb-6">
                            Your one-stop destination for premium fashion. We bring you the latest trends at unbeatable prices.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-orange-500 transition">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-orange-500 transition">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-orange-500 transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-orange-500 transition">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-blue-200">
                            <li><Link href="/about" className="hover:text-orange-400 transition">About Us</Link></li>
                            <li><Link href="/shop" className="hover:text-orange-400 transition">Shop</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-400 transition">Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-orange-400 transition">FAQs</Link></li>
                            <li><Link href="/terms" className="hover:text-orange-400 transition">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-xl font-bold mb-6">Customer Service</h3>
                        <ul className="space-y-4 text-blue-200">
                            <li><Link href="/track-order" className="hover:text-orange-400 transition">Track Order</Link></li>
                            <li><Link href="/returns" className="hover:text-orange-400 transition">Returns & Exchanges</Link></li>
                            <li><Link href="/shipping" className="hover:text-orange-400 transition">Shipping Policy</Link></li>
                            <li><Link href="/size-guide" className="hover:text-orange-400 transition">Size Guide</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-blue-200">
                            <li className="flex items-start space-x-3">
                                <MapPin size={20} className="mt-1 flex-shrink-0 text-orange-500" />
                                <span>123 Fashion Street, Design District, NY 10001</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={20} className="flex-shrink-0 text-orange-500" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={20} className="flex-shrink-0 text-orange-500" />
                                <span>support@readymart.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-blue-800 pt-8 text-center text-blue-300 text-sm">
                    <p>&copy; {new Date().getFullYear()} ReadyMart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
