import React from 'react';
import { DistributionResult } from '../../../types';

interface IssuesDisplayProps {
    view: 'without' | 'with';
    result: DistributionResult | null;
}

export function IssuesDisplay({ view, result }: IssuesDisplayProps) {
    if (!result) return null;

    return (
        <div className="mt-4">
            {view === 'without' ? (
                <>
                    <h3 className="text-xl font-bold text-red-600 mb-2">
                        Issues Found:
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {result.issues.map((issue, i) => (
                            <div
                                key={i}
                                className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg w-72 flex-shrink-0"
                            >
                                <h4 className="font-bold">{issue.title}</h4>
                                <p className="text-sm text-slate-600">{issue.impact}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-bold text-green-600 mb-2">
                        Benefits of Planning:
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {result.benefits?.map((benefit, i) => (
                            <div
                                key={i}
                                className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg w-72 flex-shrink-0"
                            >
                                <h4 className="font-bold">{benefit.title}</h4>
                                <p className="text-sm text-slate-600">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
