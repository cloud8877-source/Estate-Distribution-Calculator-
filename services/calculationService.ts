
import { CalculatorInput, DistributionResult, Beneficiary, Issue, Benefit } from '../types';
import { formatCurrency } from '../utils/formatting';

export function calculateDistributionAct(input: CalculatorInput): DistributionResult {
  const { maritalStatus, spouse, children, parentsAlive, totalEstateValue } = input;
  const beneficiaries: Beneficiary[] = [];
  const issues: Issue[] = [];

  if (maritalStatus === 'married' && children.length > 0) {
    beneficiaries.push({ id: 'spouse', type: 'spouse', name: spouse?.name || 'Spouse', age: spouse?.age || 0, share: totalEstateValue * (1/3), percentage: 33.33, isMinor: false, relationship: 'Spouse' });
    const childShare = (totalEstateValue * (2/3)) / children.length;
    children.forEach((child, index) => {
      beneficiaries.push({ id: `child-${index}`, type: 'child', name: `Child ${index + 1}`, age: child.age, share: childShare, percentage: (2/3) * 100 / children.length, isMinor: child.age < 18, relationship: 'Child' });
      if (child.age < 18) {
        issues.push({ severity: 'critical', category: 'minors', title: `Minor Child Receives ${formatCurrency(childShare)}`, description: `Child ${index + 1} (age ${child.age}) will receive a lump sum at age 18.`, impact: 'No protection, no guidance, potential mismanagement.' });
      }
    });
    issues.push({ severity: 'high', category: 'spouse', title: 'Spouse Receives Only 1/3 of Estate', description: `Despite being the surviving partner, spouse only receives ${formatCurrency(totalEstateValue * (1/3))}.`, impact: 'May be insufficient for living expenses and dependents.' });
  } else if (maritalStatus === 'married' && children.length === 0) {
    if (parentsAlive !== 'none') {
      beneficiaries.push({ id: 'spouse', type: 'spouse', name: spouse?.name || 'Spouse', age: spouse?.age || 0, share: totalEstateValue * 0.5, percentage: 50, isMinor: false, relationship: 'Spouse' });
      beneficiaries.push({ id: 'parents', type: 'parent', name: 'Parents', age: 70, share: totalEstateValue * 0.5, percentage: 50, isMinor: false, relationship: 'Parents' });
      issues.push({ severity: 'high', category: 'spouse', title: 'Spouse Shares Estate with Parents', description: 'Parents receive half, which may not align with wishes.', impact: 'Spouse may need to support parents financially.' });
    } else {
      beneficiaries.push({ id: 'spouse', type: 'spouse', name: spouse?.name || 'Spouse', age: spouse?.age || 0, share: totalEstateValue, percentage: 100, isMinor: false, relationship: 'Spouse' });
    }
  } else if ((maritalStatus !== 'married' && maritalStatus !== 'single') && children.length > 0) {
    const childShare = totalEstateValue / children.length;
    children.forEach((child, index) => {
      beneficiaries.push({ id: `child-${index}`, type: 'child', name: `Child ${index + 1}`, age: child.age, share: childShare, percentage: 100 / children.length, isMinor: child.age < 18, relationship: 'Child' });
      if (child.age < 18) {
        issues.push({ severity: 'critical', category: 'minors', title: `Minor Child Without Guardian Control`, description: `Child ${index + 1} (age ${child.age}) receives inheritance directly at 18.`, impact: 'No trustee or guardian to manage funds until adulthood.' });
      }
    });
  } else if (parentsAlive !== 'none' && children.length === 0 && maritalStatus !== 'married') {
    beneficiaries.push({ id: 'parents', type: 'parent', name: 'Parents', age: 70, share: totalEstateValue, percentage: 100, isMinor: false, relationship: 'Parents' });
  } else {
     beneficiaries.push({ id: 'gov', type: 'sibling', name: 'Government', age: 0, share: totalEstateValue, percentage: 100, isMinor: false, relationship: 'Government (Bona Vacantia)'});
     issues.push({ severity: 'critical', category: 'control', title: 'Entire Estate Goes to Government', description: 'Without any legal heirs under the Distribution Act, the estate is transferred to the government.', impact: 'Family and loved ones receive nothing.' });
  }

  issues.push({ severity: 'high', category: 'timing', title: 'Probate Process: 12-24 Months', description: 'Assets frozen during court probate process.', impact: 'Family cannot access funds for living expenses.' });
  issues.push({ severity: 'medium', category: 'costs', title: 'Probate Costs: 2-4% of Estate', description: `Estimated legal fees: ${formatCurrency(totalEstateValue * 0.03)}.`, impact: 'Reduces inheritance for beneficiaries.' });
  issues.push({ severity: 'high', category: 'control', title: 'No Control Over Distribution', description: 'Law decides who gets what, not your wishes.', impact: 'Cannot protect vulnerable beneficiaries or add conditions.' });

  return { beneficiaries, issues, benefits: [], summary: { totalDistributed: totalEstateValue, numberOfBeneficiaries: beneficiaries.length, probateDuration: '12-24 months', estimatedCosts: totalEstateValue * 0.03 } };
}

export function calculateOptimalPlanning(input: CalculatorInput): DistributionResult {
  const { maritalStatus, spouse, children, totalEstateValue } = input;
  const beneficiaries: Beneficiary[] = [];
  const benefits: Benefit[] = [];

  if (maritalStatus === 'married' && children.length > 0) {
    beneficiaries.push({ id: 'spouse', type: 'spouse', name: spouse?.name || 'Spouse', age: spouse?.age || 0, share: totalEstateValue * 0.5, percentage: 50, isMinor: false, relationship: 'Spouse - Primary Beneficiary' });
    const childShare = (totalEstateValue * 0.5) / children.length;
    children.forEach((child, index) => {
      beneficiaries.push({ id: `child-${index}`, type: 'child', name: `Child ${index + 1}`, age: child.age, share: childShare, percentage: 50 / children.length, isMinor: child.age < 18, relationship: child.age < 18 ? 'Child - Trust Beneficiary' : 'Child' });
    });
  } else if (maritalStatus === 'married' && children.length === 0) {
     beneficiaries.push({ id: 'spouse', type: 'spouse', name: spouse?.name || 'Spouse', age: spouse?.age || 0, share: totalEstateValue, percentage: 100, isMinor: false, relationship: 'Spouse' });
  } else {
     // Default to equal split among children if not married
     const childShare = children.length > 0 ? totalEstateValue / children.length : 0;
     children.forEach((child, index) => {
        beneficiaries.push({ id: `child-${index}`, type: 'child', name: `Child ${index + 1}`, age: child.age, share: childShare, percentage: 100 / children.length, isMinor: child.age < 18, relationship: 'Child' });
     });
     if (children.length === 0) {
        beneficiaries.push({ id: 'charity', type: 'parent', name: 'Chosen Beneficiary', age: 0, share: totalEstateValue, percentage: 100, isMinor: false, relationship: 'e.g., Charity / Sibling' });
     }
  }

  benefits.push({ category: 'control', title: 'Full Control Over Distribution', description: 'You decide who gets what, when, and how.', value: 'Customized to your wishes' });
  benefits.push({ category: 'protection', title: 'Trust Protection for Minors', description: 'Funds managed by trustee until children mature.', value: 'Education, living expenses managed properly' });
  benefits.push({ category: 'spouse', title: 'Adequate Spouse Protection', description: 'Spouse receives a planned share based on needs.', value: 'Financial Security' });
  benefits.push({ category: 'timing', title: 'Faster Asset Transfer', description: 'Assets can transfer much quicker, often avoiding probate.', value: 'Access within weeks, not years' });
  benefits.push({ category: 'costs', title: 'Reduced Administration Costs', description: 'Avoid court fees and lengthy probate.', value: `Save up to ~${formatCurrency(totalEstateValue * 0.035)}` });

  return { beneficiaries, issues: [], benefits, summary: { totalDistributed: totalEstateValue, numberOfBeneficiaries: beneficiaries.length, probateDuration: 'Immediate to 3 months', estimatedCosts: totalEstateValue * 0.005 } };
}
