import { getLatestReports } from './reportStorage.js';

export async function generateReportDiff(url, currentScores, currentReport) {
  const previousReports = await getLatestReports(url, 2);
  const previousReport = previousReports[1]; // Get the second-to-last report

  if (!previousReport || !previousReport.scores) {
    return null; // No previous report to compare or invalid structure
  }

  const diff = {
    scoreChanges: {},
    metricChanges: {},
    newIssues: [],
    resolvedIssues: [],
  };

  // Compare scores
  for (const [key, value] of Object.entries(currentScores)) {
    const previousScore = previousReport.scores[key] || 0;
    diff.scoreChanges[key] = {
      previous: previousScore,
      current: value,
      change: value - previousScore,
    };
  }

  // Compare key metrics
  const metricsToCompare = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time'];
  for (const metric of metricsToCompare) {
    const currentValue = currentReport.audits[metric]?.numericValue || 0;
    const previousValue = previousReport.fullReport?.audits?.[metric]?.numericValue || 0;
    diff.metricChanges[metric] = {
      previous: previousValue,
      current: currentValue,
      change: currentValue - previousValue,
      changePercentage: previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0,
    };
  }

  // Compare issues
  const currentIssues = getIssues(currentReport);
  const previousIssues = getIssues(previousReport.fullReport || {});

  diff.newIssues = currentIssues.filter(issue => !previousIssues.includes(issue));
  diff.resolvedIssues = previousIssues.filter(issue => !currentIssues.includes(issue));

  return diff;
}

function getIssues(report) {
  return Object.values(report.audits || {})
    .filter(audit => audit && audit.score < 1)
    .map(audit => audit.title);
}