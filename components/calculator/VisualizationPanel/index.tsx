import React from 'react';
import { Node, Edge } from 'reactflow';
import { DistributionResult } from '../../../types';
import { SummaryCards } from './SummaryCards';
import { ViewToggle } from './ViewToggle';
import { IssuesDisplay } from './IssuesDisplay';
import InheritanceTree from '../InheritanceTree';

interface VisualizationPanelProps {
    estateValue: number;
    view: 'without' | 'with';
    onViewChange: (view: 'without' | 'with') => void;
    currentResult: DistributionResult | null;
    resultsWithout: DistributionResult | null;
    treeNodes: Node[];
    treeEdges: Edge[];
}

export function VisualizationPanel({
    estateValue,
    view,
    onViewChange,
    currentResult,
    resultsWithout,
    treeNodes,
    treeEdges
}: VisualizationPanelProps) {
    return (
        <section className="lg:col-span-3 xl:col-span-4 bg-white p-6 rounded-xl shadow-lg flex flex-col">
            {resultsWithout && (
                <SummaryCards
                    estateValue={estateValue}
                    currentResult={currentResult}
                    issuesCount={resultsWithout.issues.length}
                />
            )}

            <ViewToggle view={view} onViewChange={onViewChange} />

            <div className="flex-grow h-[60vh] rounded-lg border bg-slate-100">
                <InheritanceTree nodes={treeNodes} edges={treeEdges} />
            </div>

            <IssuesDisplay view={view} result={currentResult} />
        </section>
    );
}
