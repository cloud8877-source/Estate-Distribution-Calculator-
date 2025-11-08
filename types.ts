
export interface CalculatorInput {
  userName: string;
  age: number;
  maritalStatus: 'married' | 'single' | 'divorced' | 'widowed';
  spouse?: {
    name: string;
    age: number;
  };
  numberOfChildren: number;
  children: Array<{
    age: number;
    isMinor: boolean;
  }>;
  parentsAlive: 'both' | 'one' | 'none';
  totalEstateValue: number;
}

export interface Beneficiary {
  id: string;
  type: 'spouse' | 'child' | 'parent' | 'sibling' | 'group';
  name: string;
  age?: number;
  share: number;
  percentage: number;
  isMinor?: boolean;
  relationship: string;
}

export interface Issue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'minors' | 'spouse' | 'timing' | 'costs' | 'control';
  title: string;
  description: string;
  impact: string;
}

export interface Benefit {
  category: 'control' | 'protection' | 'spouse' | 'timing' | 'costs';
  title: string;
  description: string;
  value: string;
}

export interface DistributionResult {
  beneficiaries: Beneficiary[];
  issues: Issue[];
  benefits: Benefit[];
  summary: {
    totalDistributed: number;
    numberOfBeneficiaries: number;
    probateDuration: string;
    estimatedCosts: number;
  };
}
