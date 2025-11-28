"use client"

import { ChevronDown } from "lucide-react"

interface SortDropdownProps {
    value: string
    onChange: (value: string) => void
}

const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
]

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
    const selectedOption = sortOptions.find(opt => opt.value === value) || sortOptions[0]

    return (
        <div className="relative inline-block">
            <label className="text-sm font-medium text-gray-700 mr-3">Sort by:</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
            >
                {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
        </div>
    )
}
