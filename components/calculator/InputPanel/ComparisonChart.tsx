import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../../utils/formatting';

interface ComparisonChartProps {
    data: Array<{
        name: string;
        Without: number;
        With: number;
        unit: string;
    }>;
}

export function ComparisonChart({ data }: ComparisonChartProps) {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Cost & Time Comparison</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                    <XAxis type="number" hide />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={100}
                        tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                        formatter={(value, name, props) => {
                            const formattedValue = typeof value === 'number'
                                ? props.payload.unit === ' (RM)'
                                    ? formatCurrency(value)
                                    : value.toLocaleString()
                                : value;
                            return `${formattedValue}${props.payload.unit || ''}`;
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar
                        dataKey="Without"
                        stackId="a"
                        fill="#F87171"
                        name="Without Will"
                    />
                    <Bar
                        dataKey="With"
                        stackId="a"
                        fill="#4ADE80"
                        name="With Planning"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
