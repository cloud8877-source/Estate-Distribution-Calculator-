import React, { useState } from 'react';
import { CalculatorInput } from './types';
import { Header } from './components/layout/Header';
import { InputPanel } from './components/calculator/InputPanel';
import { VisualizationPanel } from './components/calculator/VisualizationPanel';
import { EmailCaptureModal } from './components/modal/EmailCaptureModal';
import { useCalculator } from './hooks/useCalculator';
import { useCalculatorInput } from './hooks/useCalculatorInput';

const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
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
    } = useCalculator();

    const { handleChildChange, handleNumChildrenChange, setScenario } = useCalculatorInput({
        input,
        setInput,
        setResults
    });

    const handleInputChange = (updates: Partial<CalculatorInput>) => {
        setInput(prev => ({ ...prev, ...updates }));
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800">
            <Header onGetReport={() => setIsModalOpen(true)} />

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
                <InputPanel
                    input={input}
                    onInputChange={handleInputChange}
                    onNumChildrenChange={handleNumChildrenChange}
                    onChildAgeChange={handleChildChange}
                    onSelectScenario={setScenario}
                    onCalculate={handleCalculate}
                    comparisonData={comparisonData}
                />

                <VisualizationPanel
                    estateValue={input.totalEstateValue}
                    view={view}
                    onViewChange={setView}
                    currentResult={currentResult}
                    resultsWithout={results.without}
                    treeNodes={view === 'without' ? treeData.without.nodes : treeData.with.nodes}
                    treeEdges={view === 'without' ? treeData.without.edges : treeData.with.edges}
                />
            </main>

            <EmailCaptureModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default App;
