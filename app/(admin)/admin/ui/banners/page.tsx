export default function BannerManagementPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-8">Manage Banners</h1>

            {/* Home Carousel Section */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Home Carousel Slides</h2>
                    <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
                        + Add New Slide
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Subtitle</th>
                                <th className="p-4">Link</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-4">1</td>
                                <td className="p-4">Summer Collection</td>
                                <td className="p-4">Up to 50% Off</td>
                                <td className="p-4">/shop?cat=summer</td>
                                <td className="p-4 space-x-2">
                                    <button className="text-blue-600 hover:underline">Edit</button>
                                    <button className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4">2</td>
                                <td className="p-4">Men's Wear</td>
                                <td className="p-4">Elevate Your Style</td>
                                <td className="p-4">/shop?cat=men</td>
                                <td className="p-4 space-x-2">
                                    <button className="text-blue-600 hover:underline">Edit</button>
                                    <button className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Offer Banner Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Offer Banner Configuration</h2>
                <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                defaultValue="Deal of the Day"
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Description</label>
                            <textarea
                                defaultValue="Get up to 40% off on selected winter jackets."
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Time</label>
                                <input
                                    type="time"
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                            <input
                                type="text"
                                defaultValue="/shop?offer=deal-of-day"
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
                            Save Changes
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
