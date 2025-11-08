import React from 'react';
import { CalculatorInput } from '../../../types';
import { EstateValueSlider } from './EstateValueSlider';
import { FamilyDetailsForm } from './FamilyDetailsForm';
import { ChildrenInputs } from './ChildrenInputs';
import { QuickScenarios } from './QuickScenarios';
import { ComparisonChart } from './ComparisonChart';

interface InputPanelProps {
    input: CalculatorInput;
    onInputChange: (updates: Partial<CalculatorInput>) => void;
    onNumChildrenChange: (num: number) => void;
    onChildAgeChange: (index: number, age: string) => void;
    onSelectScenario: (scenario: CalculatorInput) => void;
    onCalculate: () => void;
    comparisonData: Array<{
        name: string;
        Without: number;
        With: number;
        unit: string;
    }>;
}

export function InputPanel({
    input,
    onInputChange,
    onNumChildrenChange,
    onChildAgeChange,
    onSelectScenario,
    onCalculate,
    comparisonData
}: InputPanelProps) {
    return (
        <aside className="lg:col-span-1 xl:col-span-1 bg-white p-6 rounded-xl shadow-lg flex flex-col h-full max-h-[calc(100vh-100px)]">
            <div className="overflow-y-auto pr-2 flex-grow">
                <h2 className="text-xl font-bold border-b pb-2 mb-4">Your Details</h2>
                <div className="space-y-4">
                    <EstateValueSlider
                        value={input.totalEstateValue}
                        onChange={(value) => onInputChange({ totalEstateValue: value })}
                    />

                    <FamilyDetailsForm
                        input={input}
                        onInputChange={onInputChange}
                    />

                    <ChildrenInputs
                        input={input}
                        onNumChildrenChange={onNumChildrenChange}
                        onChildAgeChange={onChildAgeChange}
                    />
                </div>

                <QuickScenarios onSelectScenario={onSelectScenario} />

                <ComparisonChart data={comparisonData} />
            </div>

            <button
                onClick={onCalculate}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-300 text-lg mt-4 flex-shrink-0"
            >
                Update Visualization
            </button>
        </aside>
    );
}
