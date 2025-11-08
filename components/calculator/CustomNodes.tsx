
import React from 'react';
import { Handle, Position } from 'reactflow';
import { formatCurrency } from '../../utils/formatting';
import { Issue } from '../../types';

export function EstateNode({ data }: { data: any }) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-2xl border-2 border-blue-800 p-5 w-72 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-4xl">🏠</span>
        <h3 className="text-2xl font-bold">Your Estate</h3>
      </div>
      <div className="text-4xl font-bold mt-2 tracking-tight">
        {formatCurrency(data.value)}
      </div>
      <div className="text-sm opacity-90 mt-1">
        {data.ownerName}, Age {data.ownerAge}
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-4 !h-4 !bg-blue-300" />
    </div>
  );
}

export function BeneficiaryNode({ data }: { data: any }) {
  const hasIssues = data.issues && data.issues.length > 0;
  
  const colorClasses = hasIssues
    ? 'bg-red-100 border-red-400 text-red-900'
    : data.type === 'sibling' ? 'bg-gray-100 border-gray-400 text-gray-800' : 'bg-green-100 border-green-400 text-green-900';
    
  const icon = {
    spouse: '❤️',
    child: '👶',
    parent: '👴👵',
    sibling: '👥',
    group: '👨‍👩‍👧‍👦',
  }[data.type] || '👤';

  return (
    <div className={`${colorClasses} rounded-xl shadow-lg border-2 p-4 w-64`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <div>
          <h4 className="font-bold uppercase text-sm opacity-80">{data.type === 'group' ? '' : data.type}</h4>
          <div className="font-semibold text-lg leading-tight">{data.name}{data.age ? `, ${data.age}` : ''}</div>
        </div>
      </div>
      
      <div className="text-3xl font-bold mt-3">{formatCurrency(data.share)}</div>
      <div className="text-sm opacity-75">({data.percentage.toFixed(1)}% of estate)</div>
      <div className="text-xs opacity-60">{data.relationship}</div>
      
      {hasIssues && (
        <div className="mt-3 pt-3 border-t border-red-200 space-y-1">
          {data.issues.slice(0, 1).map((issue: Issue, idx: number) => (
            <div key={idx} className="text-xs flex items-start gap-1.5">
              <span className="mt-0.5">⚠️</span>
              <span className="font-semibold">{issue.title}</span>
            </div>
          ))}
        </div>
      )}
      
      {data.isMinor && (
        <div className="mt-2 bg-yellow-200 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full inline-block">
          MINOR (UNDER 18)
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
    </div>
  );
}

export const nodeTypes = {
  estate: EstateNode,
  beneficiary: BeneficiaryNode,
};
