export function generatePerformanceInsights(report) {
  const insights = {
    metrics: {},
    keyIssues: [],
    recommendations: [],
  };

  // Analyze FCP
  insights.metrics.firstContentfulPaint = {
    value: report.audits['first-contentful-paint'].numericValue,
    score: report.audits['first-contentful-paint'].score,
    displayValue: report.audits['first-contentful-paint'].displayValue,
  };

  // Analyze LCP
  insights.metrics.largestContentfulPaint = {
    value: report.audits['largest-contentful-paint'].numericValue,
    score: report.audits['largest-contentful-paint'].score,
    displayValue: report.audits['largest-contentful-paint'].displayValue,
  };

  // Analyze TBT
  insights.metrics.totalBlockingTime = {
    value: report.audits['total-blocking-time'].numericValue,
    score: report.audits['total-blocking-time'].score,
    displayValue: report.audits['total-blocking-time'].displayValue,
  };

  // Analyze key issues
  if (report.audits['render-blocking-resources'].score < 1) {
    insights.keyIssues.push({
      name: 'Render-blocking resources',
      description: report.audits['render-blocking-resources'].description,
    });
  }

  if (report.audits['unused-javascript'].score < 1) {
    insights.keyIssues.push({
      name: 'Unused JavaScript',
      description: report.audits['unused-javascript'].description,
    });
  }

  // Add recommendations
  insights.recommendations = insights.keyIssues.map(issue => ({
    issue: issue.name,
    recommendation: `Optimize ${issue.name.toLowerCase()} to improve performance.`
  }));

  return insights;
}