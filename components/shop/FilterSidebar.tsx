"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"

interface Category {
    id: string
    name: string
}

interface Brand {
    id: string
    name: string
}

interface FilterSidebarProps {
    categories: Category[]
    brands: Brand[]
    selectedCategories: string[]
    selectedBrands: string[]
    minPrice: number
    maxPrice: number
    priceRange: [number, number]
    onCategoryChange: (categoryIds: string[]) => void
    onBrandChange: (brandIds: string[]) => void
    onPriceChange: (range: [number, number]) => void
    onClearFilters: () => void
}

export default function FilterSidebar({
    categories,
    brands,
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    priceRange,
    onCategoryChange,
    onBrandChange,
    onPriceChange,
    onClearFilters,
}: FilterSidebarProps) {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true)
    const [isBrandOpen, setIsBrandOpen] = useState(true)
    const [isPriceOpen, setIsPriceOpen] = useState(true)
    const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange)

    useEffect(() => {
        setLocalPriceRange(priceRange)
    }, [priceRange])

    const handleCategoryToggle = (categoryId: string) => {
        const newSelection = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId]
        onCategoryChange(newSelection)
    }

    const handleBrandToggle = (brandId: string) => {
        const newSelection = selectedBrands.includes(brandId)
            ? selectedBrands.filter(id => id !== brandId)
            : [...selectedBrands, brandId]
        onBrandChange(newSelection)
    }

    const handlePriceChange = (index: 0 | 1, value: number) => {
        const newRange: [number, number] = [...localPriceRange] as [number, number]
        newRange[index] = value
        setLocalPriceRange(newRange)
    }

    const applyPriceFilter = () => {
        onPriceChange(localPriceRange)
    }

    const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 ||
        (priceRange[0] !== minPrice || priceRange[1] !== maxPrice)

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                    >
                        <X size={16} />
                        Clear All
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div className="mb-6 pb-6 border-b border-gray-200">
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex items-center justify-between w-full mb-3 text-left"
                >
                    <h3 className="font-semibold text-gray-900">Categories</h3>
                    {isCategoryOpen ? (
                        <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                    )}
                </button>
                {isCategoryOpen && (
                    <div className="space-y-2">
                        {categories.map(category => (
                            <label
                                key={category.id}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCategoryToggle(category.id)}
                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                    {category.name}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Brand Filter */}
            <div className="mb-6 pb-6 border-b border-gray-200">
                <button
                    onClick={() => setIsBrandOpen(!isBrandOpen)}
                    className="flex items-center justify-between w-full mb-3 text-left"
                >
                    <h3 className="font-semibold text-gray-900">Brands</h3>
                    {isBrandOpen ? (
                        <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                    )}
                </button>
                {isBrandOpen && (
                    <div className="space-y-2">
                        {brands.map(brand => (
                            <label
                                key={brand.id}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand.id)}
                                    onChange={() => handleBrandToggle(brand.id)}
                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                    {brand.name}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Range Filter */}
            <div>
                <button
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                    className="flex items-center justify-between w-full mb-3 text-left"
                >
                    <h3 className="font-semibold text-gray-900">Price Range</h3>
                    {isPriceOpen ? (
                        <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                    )}
                </button>
                {isPriceOpen && (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-600 mb-1 block">Min</label>
                                <input
                                    type="number"
                                    value={localPriceRange[0]}
                                    onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                                    min={minPrice}
                                    max={localPriceRange[1]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-600 mb-1 block">Max</label>
                                <input
                                    type="number"
                                    value={localPriceRange[1]}
                                    onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                                    min={localPriceRange[0]}
                                    max={maxPrice}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Range Slider */}
                        <div className="relative pt-2">
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={localPriceRange[0]}
                                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                style={{ zIndex: localPriceRange[0] > localPriceRange[1] - 100 ? 5 : 3 }}
                            />
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={localPriceRange[1]}
                                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                style={{ zIndex: 4 }}
                            />
                        </div>

                        <button
                            onClick={applyPriceFilter}
                            className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
                        >
                            Apply Price Filter
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
