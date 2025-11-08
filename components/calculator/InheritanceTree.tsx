import React from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import { nodeTypes } from './CustomNodes';

interface InheritanceTreeProps {
  nodes: Node[];
  edges: Edge[];
}

const InheritanceTree: React.FC<InheritanceTreeProps> = ({ nodes, edges }) => {
  return (
    <div className="w-full h-full bg-slate-200 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="react-flow-node"
      >
        <Background />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
};

export default InheritanceTree;