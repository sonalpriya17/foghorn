import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import { getReportDir, formatDateToIST } from './reportStorage.js';

function getScoreClass(score) {
  if (score >= 90) return 'good';
  if (score >= 50) return 'average';
  return 'poor';
}

function generateChartData(comparisonData) {
  if (!comparisonData || comparisonData.length === 0) {
    return { labels: [], datasets: [] };
  }

  const labels = comparisonData.map(report => formatDateToIST(report.timestamp));
  const datasets = [
    {
      label: 'Performance',
      data: comparisonData.map(report => report.scores?.performance ?? 0),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    },
    {
      label: 'Accessibility',
      data: comparisonData.map(report => report.scores?.accessibility ?? 0),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    },
    {
      label: 'SEO',
      data: comparisonData.map(report => report.scores?.seo ?? 0),
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1
    },
    {
      label: 'Best Practices',
      data: comparisonData.map(report => report.scores?.bestPractices ?? 0),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ];

  return { labels, datasets };
}

export async function generateReports(url, report, comparisonData) {
  const reportDir = await getReportDir(url);
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const htmlFilename = path.join(reportDir, 'html', `report-${timestamp}.html`);
  const jsonFilename = path.join(reportDir, 'json', `report-${timestamp}.json`);

  const latestReports = comparisonData.slice(0, 5); // Get only the latest 5 reports
  const chartData = generateChartData(latestReports);
  const templatePath = path.join(import.meta.dirname, 'templates', 'report.ejs');
  const template = await fs.readFile(templatePath, 'utf-8');
  const htmlContent = ejs.render(template, { 
    report, 
    comparisonData: latestReports, 
    chartData, 
    getScoreClass,
    formatDateToIST
  });

  await fs.mkdir(path.dirname(htmlFilename), { recursive: true });
  await fs.writeFile(htmlFilename, htmlContent);

  await fs.mkdir(path.dirname(jsonFilename), { recursive: true });
  await fs.writeFile(jsonFilename, JSON.stringify({ report, comparisonData: latestReports }, null, 2));

  return { htmlFilename, jsonFilename };
}

export { formatDateToIST };