import { useState, useMemo, useCallback, useEffect } from 'react';
import { CalculatorInput, DistributionResult } from '../types';
import { calculateDistributionAct, calculateOptimalPlanning } from '../services/calculationService';
import { generateTreeData } from '../services/treeService';
import { DEFAULT_SCENARIO } from '../constants/scenarios';

export function useCalculator() {
    const [input, setInput] = useState<CalculatorInput>(DEFAULT_SCENARIO);
    const [results, setResults] = useState<{
        without: DistributionResult | null;
        with: DistributionResult | null;
    }>({ without: null, with: null });
    const [view, setView] = useState<'without' | 'with'>('without');

    const handleCalculate = useCallback(() => {
        const withoutWill = calculateDistributionAct(input);
        const withPlanning = calculateOptimalPlanning(input);
        setResults({ without: withoutWill, with: withPlanning });
    }, [input]);

    const treeData = useMemo(() => {
        if (!results.without || !results.with) {
            return {
                without: { nodes: [], edges: [] },
                with: { nodes: [], edges: [] }
            };
        }
        return {
            without: generateTreeData(results.without, input, 'without'),
            with: generateTreeData(results.with, input, 'with'),
        };
    }, [results, input]);

    const currentResult = view === 'without' ? results.without : results.with;

    const comparisonData = useMemo(() => [
        {
            name: 'Probate Duration',
            Without: 24,
            With: 3,
            unit: ' months'
        },
        {
            name: 'Legal Costs',
            Without: results.without?.summary.estimatedCosts ?? 0,
            With: results.with?.summary.estimatedCosts ?? 0,
            unit: ' (RM)'
        },
        {
            name: 'Spouse Share',
            Without: results.without?.beneficiaries?.find(b => b.type === 'spouse')?.share ?? 0,
            With: results.with?.beneficiaries?.find(b => b.type === 'spouse')?.share ?? 0,
            unit: ' (RM)'
        },
    ], [results]);

    // Calculate on mount
    useEffect(() => {
        handleCalculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        input,
        setInput,
        results,
        setResults,
        view,
        setView,
        currentResult,
        treeData,
        comparisonData,
        handleCalculate,
    };
}
