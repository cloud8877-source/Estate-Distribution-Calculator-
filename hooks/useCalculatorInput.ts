import { useCallback } from 'react';
import { CalculatorInput } from '../types';
import { calculateDistributionAct, calculateOptimalPlanning } from '../services/calculationService';

interface UseCalculatorInputProps {
    input: CalculatorInput;
    setInput: React.Dispatch<React.SetStateAction<CalculatorInput>>;
    setResults: (results: any) => void;
}

export function useCalculatorInput({ input, setInput, setResults }: UseCalculatorInputProps) {
    const handleChildChange = useCallback((index: number, age: string) => {
        const newChildren = [...input.children];
        const newAge = parseInt(age, 10);
        if (!isNaN(newAge)) {
            newChildren[index] = { age: newAge, isMinor: newAge < 18 };
            setInput(prev => ({ ...prev, children: newChildren }));
        }
    }, [input.children, setInput]);

    const handleNumChildrenChange = useCallback((num: number) => {
        const newNum = Math.max(0, Math.min(10, num));
        const currentChildren = input.children;
        let newChildren = [...currentChildren];

        if (newNum > currentChildren.length) {
            const toAdd = newNum - currentChildren.length;
            for (let i = 0; i < toAdd; i++) {
                newChildren.push({ age: 10, isMinor: true });
            }
        } else if (newNum < currentChildren.length) {
            newChildren = currentChildren.slice(0, newNum);
        }

        setInput(prev => ({
            ...prev,
            numberOfChildren: newNum,
            children: newChildren,
        }));
    }, [input.children, setInput]);

    const setScenario = useCallback((scenario: CalculatorInput) => {
        setInput(scenario);
        const withoutWill = calculateDistributionAct(scenario);
        const withPlanning = calculateOptimalPlanning(scenario);
        setResults({ without: withoutWill, with: withPlanning });
    }, [setInput, setResults]);

    return {
        handleChildChange,
        handleNumChildrenChange,
        setScenario,
    };
}
