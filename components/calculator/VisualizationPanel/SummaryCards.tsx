import React from 'react';
import { formatCurrency } from '../../../utils/formatting';
import { DistributionResult } from '../../../types';

interface SummaryCardsProps {
    estateValue: number;
    currentResult: DistributionResult | null;
    issuesCount: number;
}

export function SummaryCards({ estateValue, currentResult, issuesCount }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div className="bg-slate-100 p-3 rounded-lg">
                <h4 className="font-bold text-slate-600">Estate Value</h4>
                <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(estateValue)}
                </p>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
                <h4 className="font-bold text-slate-600">Beneficiaries</h4>
                <p className="text-2xl font-bold">
                    {currentResult?.summary.numberOfBeneficiaries}
                </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
                <h4 className="font-bold text-red-600">Critical Issues</h4>
                <p className="text-2xl font-bold text-red-600">{issuesCount}</p>
            </div>
        </div>
    );
}
