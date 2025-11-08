
import { Node, Edge } from 'reactflow';
import { DistributionResult, CalculatorInput, Issue } from '../types';
import { formatCurrency } from '../utils/formatting';

export function generateTreeData(
  result: DistributionResult,
  input: CalculatorInput,
  variant: 'without' | 'with'
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const isWithout = variant === 'without';

  nodes.push({
    id: 'estate',
    type: 'estate',
    position: { x: 250, y: 25 },
    data: {
      value: input.totalEstateValue,
      ownerName: input.userName || 'You',
      ownerAge: input.age,
    }
  });
  
  const hasSpouse = result.beneficiaries.some(b => b.type === 'spouse');
  const hasParents = result.beneficiaries.some(b => b.type === 'parent');
  const children = result.beneficiaries.filter(b => b.type === 'child');
  const hasSiblingsOrGov = result.beneficiaries.some(b => b.type === 'sibling');

  let yPos = 250;
  let xPos = 50;
  const xSpacing = 280;

  const addNodeAndEdge = (beneficiary: any, position: {x: number, y: number}) => {
     const nodeId = beneficiary.id;
     nodes.push({
        id: nodeId,
        type: 'beneficiary',
        position,
        data: {
          ...beneficiary,
          issues: isWithout ? result.issues.filter((issue: Issue) => 
            (issue.category === 'minors' && beneficiary.isMinor) ||
            (issue.category === 'spouse' && beneficiary.type === 'spouse') ||
            (issue.title.includes('Government'))
            ) : [],
        }
      });

      edges.push({
        id: `estate-${nodeId}`,
        source: 'estate',
        target: nodeId,
        type: 'smoothstep',
        animated: true,
        label: `${formatCurrency(beneficiary.share)} (${beneficiary.percentage.toFixed(1)}%)`,
        labelStyle: { fill: isWithout ? '#DC2626' : '#059669', fontWeight: 600, fontSize: 14 },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#F8FAFC', fillOpacity: 0.7 },
        style: { stroke: isWithout ? '#F87171' : '#34D399', strokeWidth: 3 }
      });
  }

  if (hasSpouse) {
    const spouse = result.beneficiaries.find(b => b.type === 'spouse');
    if (spouse) addNodeAndEdge(spouse, {x: xPos, y: yPos});
    xPos += xSpacing;
  }

  if (children.length > 1) {
    const totalChildShare = children.reduce((acc, c) => acc + c.share, 0);
    const totalChildPercentage = children.reduce((acc, c) => acc + c.percentage, 0);
    const groupNodeId = 'children-group';

    nodes.push({
      id: groupNodeId,
      type: 'beneficiary',
      position: { x: xPos, y: yPos },
      data: {
        id: groupNodeId,
        type: 'group',
        name: 'Children',
        share: totalChildShare,
        percentage: totalChildPercentage,
        relationship: `${children.length} children`,
        issues: isWithout ? result.issues.filter((issue: Issue) => issue.category === 'minors') : [],
      }
    });

    edges.push({
      id: `estate-${groupNodeId}`,
      source: 'estate',
      target: groupNodeId,
      type: 'smoothstep',
      animated: true,
      label: `${formatCurrency(totalChildShare)} (${totalChildPercentage.toFixed(1)}%)`,
      labelStyle: { fill: isWithout ? '#DC2626' : '#059669', fontWeight: 600, fontSize: 14 },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: '#F8FAFC', fillOpacity: 0.7 },
      style: { stroke: isWithout ? '#F87171' : '#34D399', strokeWidth: 3 }
    });

    children.forEach((child, index) => {
      const childNodeId = child.id;
      nodes.push({
        id: childNodeId,
        type: 'beneficiary',
        position: { x: xPos + (index * xSpacing/2) - (children.length-1)*xSpacing/4 , y: yPos + 250 },
        data: { ...child, issues: isWithout && child.isMinor ? result.issues.filter(issue => issue.category === 'minors') : [] },
        parentNode: groupNodeId,
        extent: 'parent',
      });
      edges.push({
         id: `${groupNodeId}-${childNodeId}`,
         source: groupNodeId,
         target: childNodeId,
         type: 'smoothstep',
      });
    });
    xPos += xSpacing;

  } else if (children.length === 1) {
    addNodeAndEdge(children[0], {x: xPos, y: yPos});
    xPos += xSpacing;
  }
  
  if (hasParents) {
    const parents = result.beneficiaries.find(b => b.type === 'parent');
    if (parents) addNodeAndEdge(parents, {x: xPos, y: yPos});
    xPos += xSpacing;
  }

  if (hasSiblingsOrGov) {
    const other = result.beneficiaries.find(b => b.type === 'sibling');
    if (other) addNodeAndEdge(other, {x: xPos, y: yPos});
  }

  return { nodes, edges };
}
