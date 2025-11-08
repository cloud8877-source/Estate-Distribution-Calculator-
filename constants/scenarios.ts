import { CalculatorInput } from '../types';

export const DEFAULT_SCENARIO: CalculatorInput = {
    userName: 'John Tan',
    age: 45,
    maritalStatus: 'married',
    spouse: { name: 'Sarah', age: 42 },
    numberOfChildren: 2,
    children: [{ age: 12, isMinor: true }, { age: 8, isMinor: true }],
    parentsAlive: 'one',
    totalEstateValue: 800000,
};

export const QUICK_SCENARIOS: { [key: string]: CalculatorInput } = {
    "Young Family": DEFAULT_SCENARIO,
    "Empty Nesters": {
        userName: 'Susan Lim',
        age: 60,
        maritalStatus: 'married',
        spouse: { name: 'David', age: 62 },
        numberOfChildren: 2,
        children: [
            { age: 35, isMinor: false },
            { age: 32, isMinor: false }
        ],
        parentsAlive: 'none',
        totalEstateValue: 1500000
    },
    "Single Parent": {
        userName: 'Aisha',
        age: 38,
        maritalStatus: 'widowed',
        numberOfChildren: 1,
        children: [{ age: 10, isMinor: true }],
        parentsAlive: 'both',
        totalEstateValue: 600000
    }
};
