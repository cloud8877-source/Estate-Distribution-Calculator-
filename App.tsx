import React, { useState, useMemo, useCallback } from 'react';
import { CalculatorInput, DistributionResult } from './types';
import { calculateDistributionAct, calculateOptimalPlanning } from './services/calculationService';
import { generateTreeData } from './services/treeService';
import InheritanceTree from './components/InheritanceTree';
import { formatCurrency } from './utils/formatting';
import { EmailCaptureModal } from './components/EmailCaptureModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const defaultInput: CalculatorInput = {
    userName: 'John Tan',
    age: 45,
    maritalStatus: 'married',
    spouse: { name: 'Sarah', age: 42 },
    numberOfChildren: 2,
    children: [{ age: 12, isMinor: true }, { age: 8, isMinor: true }],
    parentsAlive: 'one',
    totalEstateValue: 800000,
};

const App: React.FC = () => {
    const [input, setInput] = useState<CalculatorInput>(defaultInput);
    const [results, setResults] = useState<{ without: DistributionResult | null; with: DistributionResult | null }>({ without: null, with: null });
    const [view, setView] = useState<'without' | 'with'>('without');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleCalculate = useCallback(() => {
        const withoutWill = calculateDistributionAct(input);
        const withPlanning = calculateOptimalPlanning(input);
        setResults({ without: withoutWill, with: withPlanning });
    }, [input]);

    const treeData = useMemo(() => {
        if (!results.without || !results.with) return { without: { nodes: [], edges: [] }, with: { nodes: [], edges: [] } };
        return {
            without: generateTreeData(results.without, input, 'without'),
            with: generateTreeData(results.with, input, 'with'),
        };
    }, [results, input]);

    React.useEffect(() => {
        handleCalculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentResult = view === 'without' ? results.without : results.with;

    const comparisonData = [
        { name: 'Probate Duration', Without: 24, With: 3, unit: ' months' },
        { name: 'Legal Costs', Without: results.without?.summary.estimatedCosts ?? 0, With: results.with?.summary.estimatedCosts ?? 0, unit: ' (RM)'},
        { name: 'Spouse Share', Without: results.without?.beneficiaries?.find(b => b.type === 'spouse')?.share ?? 0, With: results.with?.beneficiaries?.find(b => b.type === 'spouse')?.share ?? 0, unit: ' (RM)'},
    ];

    const handleChildChange = (index: number, age: string) => {
        const newChildren = [...input.children];
        const newAge = parseInt(age, 10);
        if(!isNaN(newAge)) {
            newChildren[index] = { age: newAge, isMinor: newAge < 18 };
            setInput(prev => ({ ...prev, children: newChildren }));
        }
    };
    
    const handleNumChildrenChange = (num: number) => {
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
    }

    const setScenario = (scenario: CalculatorInput) => {
        setInput(scenario);
        const withoutWill = calculateDistributionAct(scenario);
        const withPlanning = calculateOptimalPlanning(scenario);
        setResults({ without: withoutWill, with: withPlanning });
    }

    const quickScenarios: { [key: string]: CalculatorInput } = {
        "Young Family": { ...defaultInput },
        "Empty Nesters": { userName: 'Susan Lim', age: 60, maritalStatus: 'married', spouse: { name: 'David', age: 62 }, numberOfChildren: 2, children: [{ age: 35, isMinor: false }, { age: 32, isMinor: false }], parentsAlive: 'none', totalEstateValue: 1500000 },
        "Single Parent": { userName: 'Aisha', age: 38, maritalStatus: 'widowed', numberOfChildren: 1, children: [{ age: 10, isMinor: true }], parentsAlive: 'both', totalEstateValue: 600000 }
    }


    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800">
            <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                    <h1 className="text-2xl font-bold text-slate-800">Estate Distribution Calculator <span className="text-sm font-normal text-slate-500 hidden md:inline">for Malaysia (Non-Muslims)</span></h1>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition duration-300">
                    Get Full Report
                </button>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
                {/* Input Panel */}
                <aside className="lg:col-span-1 xl:col-span-1 bg-white p-6 rounded-xl shadow-lg flex flex-col h-full max-h-[calc(100vh-100px)]">
                    <div className="overflow-y-auto pr-2 flex-grow">
                        <h2 className="text-xl font-bold border-b pb-2 mb-4">Your Details</h2>
                        <div className="space-y-4">
                           <label className="block">
                               <span className="text-gray-700 font-medium">Total Estate Value (RM)</span>
                               <input type="range" min="100000" max="10000000" step="10000" value={input.totalEstateValue} onChange={e => setInput({...input, totalEstateValue: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                               <div className="text-center font-bold text-blue-600 text-lg mt-1">{formatCurrency(input.totalEstateValue)}</div>
                           </label>
                           
                           <div className="grid grid-cols-2 gap-4">
                             <label className="block"><span className="text-gray-700 font-medium">Your Name</span><input type="text" value={input.userName} onChange={e => setInput({...input, userName: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" /></label>
                             <label className="block"><span className="text-gray-700 font-medium">Your Age</span><input type="number" value={input.age} onChange={e => setInput({...input, age: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" /></label>
                           </div>

                           <label className="block"><span className="text-gray-700 font-medium">Marital Status</span><select value={input.maritalStatus} onChange={e => setInput({...input, maritalStatus: e.target.value as any})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border bg-white"><option value="married">Married</option><option value="single">Single</option><option value="widowed">Widowed</option><option value="divorced">Divorced</option></select></label>
                           <label className="block"><span className="text-gray-700 font-medium">Parents Alive</span><select value={input.parentsAlive} onChange={e => setInput({...input, parentsAlive: e.target.value as any})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border bg-white"><option value="both">Both</option><option value="one">One</option><option value="none">None</option></select></label>
                           
                           <label className="block">
                             <span className="text-gray-700 font-medium">Number of Children</span>
                             <input type="number" value={input.numberOfChildren} onChange={e => handleNumChildrenChange(parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" />
                           </label>
                            {input.children.map((child, index) => (
                               <label key={index} className="block pl-4"><span className="text-gray-700 font-medium">Child {index+1} Age</span><input type="number" value={child.age} onChange={e => handleChildChange(index, e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" /></label>
                            ))}
                        </div>
                         <div className="mt-6">
                            <h3 className="text-lg font-bold mb-2">Quick Scenarios</h3>
                            <div className="flex gap-2 flex-wrap">
                                {Object.entries(quickScenarios).map(([name, scenario]) => (
                                    <button key={name} onClick={() => setScenario(scenario)} className="bg-slate-200 text-slate-700 text-sm font-semibold py-1 px-3 rounded-full hover:bg-slate-300 transition">{name}</button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-bold mb-2">Cost & Time Comparison</h3>
                            <ResponsiveContainer width="100%" height={200}>
                               <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 11}}/>
                                    <Tooltip formatter={(value, name, props) => `${typeof value === 'number' ? (props.payload.unit === ' (RM)' ? formatCurrency(value) : value.toLocaleString()) : value}${props.payload.unit || ''}`} />
                                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                                    <Bar dataKey="Without" stackId="a" fill="#F87171" name="Without Will" />
                                    <Bar dataKey="With" stackId="a" fill="#4ADE80" name="With Planning" />
                               </BarChart>
                            </ResponsiveContainer>
                       </div>
                    </div>
                    <button onClick={handleCalculate} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-300 text-lg mt-4 flex-shrink-0">
                        Update Visualization
                    </button>
                </aside>

                {/* Visualization Panel */}
                <section className="lg:col-span-3 xl:col-span-4 bg-white p-6 rounded-xl shadow-lg flex flex-col">
                   {results.without && (
                       <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                           <div className="bg-slate-100 p-3 rounded-lg"><h4 className="font-bold text-slate-600">Estate Value</h4><p className="text-2xl font-bold text-blue-600">{formatCurrency(input.totalEstateValue)}</p></div>
                           <div className="bg-slate-100 p-3 rounded-lg"><h4 className="font-bold text-slate-600">Beneficiaries</h4><p className="text-2xl font-bold">{currentResult?.summary.numberOfBeneficiaries}</p></div>
                           <div className="bg-red-100 p-3 rounded-lg"><h4 className="font-bold text-red-600">Critical Issues</h4><p className="text-2xl font-bold text-red-600">{results.without.issues.length}</p></div>
                       </div>
                   )}
                   <div className="flex border-b mb-4">
                        <button onClick={() => setView('without')} className={`flex-1 py-2 font-bold text-lg ${view === 'without' ? 'border-b-4 border-red-500 text-red-600' : 'text-slate-500'}`}>Without a Will</button>
                        <button onClick={() => setView('with')} className={`flex-1 py-2 font-bold text-lg ${view === 'with' ? 'border-b-4 border-green-500 text-green-600' : 'text-slate-500'}`}>With Planning</button>
                   </div>
                   
                   <div className="flex-grow h-[60vh] rounded-lg border bg-slate-100">
                        <InheritanceTree nodes={view === 'without' ? treeData.without.nodes : treeData.with.nodes} edges={view === 'without' ? treeData.without.edges : treeData.with.edges} />
                   </div>
                   
                   <div className="mt-4">
                        {view === 'without' ? (
                            <>
                            <h3 className="text-xl font-bold text-red-600 mb-2">Issues Found:</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                            {currentResult?.issues.map((issue, i) => (
                                <div key={i} className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg w-72 flex-shrink-0">
                                    <h4 className="font-bold">{issue.title}</h4>
                                    <p className="text-sm text-slate-600">{issue.impact}</p>
                                </div>
                            ))}
                            </div>
                            </>
                        ) : (
                            <>
                            <h3 className="text-xl font-bold text-green-600 mb-2">Benefits of Planning:</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4">
                            {currentResult?.benefits.map((benefit, i) => (
                                <div key={i} className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg w-72 flex-shrink-0">
                                    <h4 className="font-bold">{benefit.title}</h4>
                                    <p className="text-sm text-slate-600">{benefit.description}</p>
                                </div>
                            ))}
                            </div>
                            </>
                        )}
                   </div>
                </section>
            </main>
            <EmailCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default App;
