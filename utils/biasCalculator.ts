export interface DecisionRecord {
  id: string;
  gender: string;
  decision: string;
  timestamp: Date | string;
}

export interface BiasMetrics {
  fairness_percentage: number;
  bias_score: number;
  bias_level: "Low" | "Medium" | "High";
  male_selection_rate: number;
  female_selection_rate: number;
  total_selected: number;
  total_rejected: number;
  total_decisions: number;
  alerts: string[];
  recommendations: string[];
  recent_decisions: DecisionRecord[];
}

export function calculateBiasMetrics(decisions: DecisionRecord[]): BiasMetrics {
  const totalDecisions = decisions.length;

  if (totalDecisions === 0) {
    return {
      fairness_percentage: 100,
      bias_score: 0,
      bias_level: "Low",
      male_selection_rate: 0,
      female_selection_rate: 0,
      total_selected: 0,
      total_rejected: 0,
      total_decisions: 0,
      alerts: [],
      recommendations: ["Start sending decision data to begin bias analysis."],
      recent_decisions: [],
    };
  }

  // Count by gender and decision
  const maleTotal = decisions.filter((d) => d.gender === "male").length;
  const femaleTotal = decisions.filter((d) => d.gender === "female").length;
  const maleSelected = decisions.filter(
    (d) => d.gender === "male" && d.decision === "selected"
  ).length;
  const femaleSelected = decisions.filter(
    (d) => d.gender === "female" && d.decision === "selected"
  ).length;
  const totalSelected = decisions.filter(
    (d) => d.decision === "selected"
  ).length;
  const totalRejected = decisions.filter(
    (d) => d.decision === "rejected"
  ).length;

  // Compute selection rates
  const maleSelectionRate = maleTotal > 0 ? maleSelected / maleTotal : 0;
  const femaleSelectionRate =
    femaleTotal > 0 ? femaleSelected / femaleTotal : 0;

  // Bias difference
  const biasDifference = Math.abs(maleSelectionRate - femaleSelectionRate);
  const biasScore = Math.round(biasDifference * 10000) / 100; // as percentage, 2 decimal places
  const fairnessPercentage = Math.round((100 - biasScore) * 100) / 100;

  // Bias level
  let biasLevel: "Low" | "Medium" | "High";
  if (biasDifference < 0.1) {
    biasLevel = "Low";
  } else if (biasDifference <= 0.25) {
    biasLevel = "Medium";
  } else {
    biasLevel = "High";
  }

  // Generate alerts
  const alerts: string[] = [];
  if (biasLevel === "High") {
    alerts.push(
      `⚠️ Critical: Significant bias detected — ${biasScore}% disparity between gender selection rates.`
    );
  }
  if (biasLevel === "Medium") {
    alerts.push(
      `⚡ Warning: Moderate bias detected — ${biasScore}% disparity between gender selection rates.`
    );
  }
  if (maleSelectionRate > femaleSelectionRate && biasDifference >= 0.1) {
    alerts.push(
      `Male candidates are being selected ${Math.round(biasDifference * 100)}% more frequently than female candidates.`
    );
  }
  if (femaleSelectionRate > maleSelectionRate && biasDifference >= 0.1) {
    alerts.push(
      `Female candidates are being selected ${Math.round(biasDifference * 100)}% more frequently than male candidates.`
    );
  }
  if (maleTotal === 0 || femaleTotal === 0) {
    alerts.push(
      `⚠️ Insufficient diversity in data pool — one gender group has zero representation.`
    );
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (biasLevel === "High") {
    recommendations.push(
      "Immediately audit the AI model's decision-making criteria for discriminatory patterns."
    );
    recommendations.push(
      "Consider implementing fairness constraints (e.g., demographic parity) in the model pipeline."
    );
    recommendations.push(
      "Engage a third-party fairness audit to review the training data distribution."
    );
  }
  if (biasLevel === "Medium") {
    recommendations.push(
      "Review recent model updates or data changes that may have introduced bias drift."
    );
    recommendations.push(
      "Implement A/B testing with fairness-aware selection criteria."
    );
  }
  if (biasLevel === "Low") {
    recommendations.push(
      "Continue monitoring — bias levels are within acceptable thresholds."
    );
    recommendations.push(
      "Maintain diverse training datasets to preserve fairness over time."
    );
  }
  if (totalDecisions < 50) {
    recommendations.push(
      "Collect more data points for statistically significant bias analysis (minimum 50 recommended)."
    );
  }

  // Recent decisions (last 10)
  const recentDecisions = decisions
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 10);

  return {
    fairness_percentage: fairnessPercentage,
    bias_score: biasScore,
    bias_level: biasLevel,
    male_selection_rate: Math.round(maleSelectionRate * 10000) / 100,
    female_selection_rate: Math.round(femaleSelectionRate * 10000) / 100,
    total_selected: totalSelected,
    total_rejected: totalRejected,
    total_decisions: totalDecisions,
    alerts,
    recommendations,
    recent_decisions: recentDecisions,
  };
}
