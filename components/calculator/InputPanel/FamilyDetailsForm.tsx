import React from 'react';
import { CalculatorInput } from '../../../types';

interface FamilyDetailsFormProps {
    input: CalculatorInput;
    onInputChange: (updates: Partial<CalculatorInput>) => void;
}

export function FamilyDetailsForm({ input, onInputChange }: FamilyDetailsFormProps) {
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-gray-700 font-medium">Your Name</span>
                    <input
                        type="text"
                        value={input.userName}
                        onChange={e => onInputChange({ userName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700 font-medium">Your Age</span>
                    <input
                        type="number"
                        value={input.age}
                        onChange={e => onInputChange({ age: parseInt(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                    />
                </label>
            </div>

            <label className="block">
                <span className="text-gray-700 font-medium">Marital Status</span>
                <select
                    value={input.maritalStatus}
                    onChange={e => onInputChange({ maritalStatus: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border bg-white"
                >
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                    <option value="widowed">Widowed</option>
                    <option value="divorced">Divorced</option>
                </select>
            </label>

            <label className="block">
                <span className="text-gray-700 font-medium">Parents Alive</span>
                <select
                    value={input.parentsAlive}
                    onChange={e => onInputChange({ parentsAlive: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border bg-white"
                >
                    <option value="both">Both</option>
                    <option value="one">One</option>
                    <option value="none">None</option>
                </select>
            </label>
        </>
    );
}
