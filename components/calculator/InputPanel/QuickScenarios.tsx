import React from 'react';
import { CalculatorInput } from '../../../types';
import { QUICK_SCENARIOS } from '../../../constants/scenarios';

interface QuickScenariosProps {
    onSelectScenario: (scenario: CalculatorInput) => void;
}

export function QuickScenarios({ onSelectScenario }: QuickScenariosProps) {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Quick Scenarios</h3>
            <div className="flex gap-2 flex-wrap">
                {Object.entries(QUICK_SCENARIOS).map(([name, scenario]) => (
                    <button
                        key={name}
                        onClick={() => onSelectScenario(scenario)}
                        className="bg-slate-200 text-slate-700 text-sm font-semibold py-1 px-3 rounded-full hover:bg-slate-300 transition"
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>
    );
}
