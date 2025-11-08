import React from 'react';

interface HeaderProps {
    onGetReport: () => void;
}

export function Header({ onGetReport }: HeaderProps) {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
                <svg
                    className="w-10 h-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                </svg>
                <h1 className="text-2xl font-bold text-slate-800">
                    Estate Distribution Calculator
                    <span className="text-sm font-normal text-slate-500 hidden md:inline">
                        {' '}for Malaysia (Non-Muslims)
                    </span>
                </h1>
            </div>
            <button
                onClick={onGetReport}
                className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Get Full Report
            </button>
        </header>
    );
}
