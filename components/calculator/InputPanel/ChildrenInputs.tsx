import React from 'react';
import { CalculatorInput } from '../../../types';

interface ChildrenInputsProps {
    input: CalculatorInput;
    onNumChildrenChange: (num: number) => void;
    onChildAgeChange: (index: number, age: string) => void;
}

export function ChildrenInputs({
    input,
    onNumChildrenChange,
    onChildAgeChange
}: ChildrenInputsProps) {
    return (
        <>
            <label className="block">
                <span className="text-gray-700 font-medium">Number of Children</span>
                <input
                    type="number"
                    value={input.numberOfChildren}
                    onChange={e => onNumChildrenChange(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                />
            </label>
            {input.children.map((child, index) => (
                <label key={index} className="block pl-4">
                    <span className="text-gray-700 font-medium">Child {index + 1} Age</span>
                    <input
                        type="number"
                        value={child.age}
                        onChange={e => onChildAgeChange(index, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                    />
                </label>
            ))}
        </>
    );
}
