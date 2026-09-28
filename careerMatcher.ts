import { Career, SkillCategory, SkillScores } from '../types';
import { CAREERS_DATA } from '../data/careersData';

export function matchCareers(userScores: SkillScores): Career[] {
  return CAREERS_DATA.map(career => {
    // Calculate weighted match
    const weights = career.requiredSkillWeights;
    let totalWeightedScore = 0;
    let totalWeight = 0;

    (Object.keys(weights) as SkillCategory[]).forEach(skill => {
      const requiredScore = weights[skill] || 75;
      const actualScore = userScores[skill] || 50;
      
      // Calculate how close the user is to the required skill
      // Higher score is rewarded, but even matching gives high percentage
      const ratio = Math.min(1.15, actualScore / requiredScore);
      const skillScore = Math.round(ratio * 90);
      
      const weight = requiredScore / 100;
      totalWeightedScore += skillScore * weight;
      totalWeight += weight;
    });

    const rawMatch = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 75;
    // Keep in realistic encouraging range 68% - 98%
    const matchPercentage = Math.max(68, Math.min(97, rawMatch));

    // Determine top 2 matching skills for this career
    const matchingSkills = (Object.keys(weights) as SkillCategory[])
      .sort((a, b) => (userScores[b] || 0) - (userScores[a] || 0))
      .slice(0, 2);

    const s1 = matchingSkills[0] || 'Logical Thinking';
    const s2 = matchingSkills[1] || 'Problem Solving';
    const score1 = userScores[s1];
    const score2 = userScores[s2];

    const whyItMatches = `Your strong ${s1.toLowerCase()} (${score1}%) and demonstrated ${s2.toLowerCase()} (${score2}%) during games make this career path a high-potential match.`;

    return {
      ...career,
      matchPercentage,
      whyItMatches,
    };
  }).sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
}
