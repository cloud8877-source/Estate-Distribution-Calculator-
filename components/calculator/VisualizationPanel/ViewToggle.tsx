import React from 'react';

interface ViewToggleProps {
    view: 'without' | 'with';
    onViewChange: (view: 'without' | 'with') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex border-b mb-4">
            <button
                onClick={() => onViewChange('without')}
                className={`flex-1 py-2 font-bold text-lg ${
                    view === 'without'
                        ? 'border-b-4 border-red-500 text-red-600'
                        : 'text-slate-500'
                }`}
            >
                Without a Will
            </button>
            <button
                onClick={() => onViewChange('with')}
                className={`flex-1 py-2 font-bold text-lg ${
                    view === 'with'
                        ? 'border-b-4 border-green-500 text-green-600'
                        : 'text-slate-500'
                }`}
            >
                With Planning
            </button>
        </div>
    );
}
