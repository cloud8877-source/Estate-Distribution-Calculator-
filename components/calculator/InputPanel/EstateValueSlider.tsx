import React from 'react';
import { formatCurrency } from '../../../utils/formatting';

interface EstateValueSliderProps {
    value: number;
    onChange: (value: number) => void;
}

export function EstateValueSlider({ value, onChange }: EstateValueSliderProps) {
    return (
        <label className="block">
            <span className="text-gray-700 font-medium">Total Estate Value (RM)</span>
            <input
                type="range"
                min="100000"
                max="10000000"
                step="10000"
                value={value}
                onChange={e => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center font-bold text-blue-600 text-lg mt-1">
                {formatCurrency(value)}
            </div>
        </label>
    );
}
