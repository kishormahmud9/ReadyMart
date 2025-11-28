"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
    min?: number
    max: number
    value: number
    onChange: (value: number) => void
    disabled?: boolean
}

export default function QuantitySelector({
    min = 1,
    max,
    value,
    onChange,
    disabled = false,
}: QuantitySelectorProps) {
    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1)
        }
    }

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value) || min
        if (newValue >= min && newValue <= max) {
            onChange(newValue)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-orange-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
            >
                <Minus size={18} />
            </button>

            <input
                type="number"
                min={min}
                max={max}
                value={value}
                onChange={handleInputChange}
                disabled={disabled}
                className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg font-semibold text-lg focus:border-orange-600 focus:outline-none disabled:opacity-50"
            />

            <button
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-orange-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
            >
                <Plus size={18} />
            </button>

            <span className="text-sm text-gray-500 ml-2">Max: {max}</span>
        </div>
    )
}
