import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import { getReportDir, formatDateToIST, getLatestReports } from './reportStorage.js';

function getScoreClass(score) {
  if (score >= 90) return 'good';
  if (score >= 50) return 'average';
  return 'poor';
}

function generateChartData(reports) {
  if (!reports || reports.length === 0) {
    return { labels: [], datasets: [] };
  }

  const labels = reports.map(report => {
    const date = new Date(report.timestamp);
    return date.toLocaleString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  });

  const datasets = [
    {
      label: 'Performance',
      data: reports.map(report => report.scores?.performance ?? 0),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    },
    {
      label: 'Accessibility',
      data: reports.map(report => report.scores?.accessibility ?? 0),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    },
    {
      label: 'SEO',
      data: reports.map(report => report.scores?.seo ?? 0),
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1
    },
    {
      label: 'Best Practices',
      data: reports.map(report => report.scores?.bestPractices ?? 0),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ];

  return { labels, datasets };
}

export async function generateReports(url, report) {
  const reportDir = await getReportDir(url);
  const timestamp = new Date().toISOString();
  const htmlFilename = path.join(reportDir, 'html', `report-${timestamp.replace(/:/g, '-')}.html`);
  const jsonFilename = path.join(reportDir, 'json', `report-${timestamp.replace(/:/g, '-')}.json`);

  // Get the 4 latest previous reports
  const previousReports = await getLatestReports(url, 4);
  
  // If there are no previous reports, use the current report for comparison
  const allReports = previousReports.length > 0 
    ? [{ ...report, timestamp }, ...previousReports].slice(0, 5)
    : [{ ...report, timestamp }];
  
  const chartData = generateChartData(allReports);
  const templatePath = path.join(import.meta.dirname, 'templates', 'report.ejs');
  const template = await fs.readFile(templatePath, 'utf-8');
  const htmlContent = ejs.render(template, { 
    report: allReports[0], 
    comparisonData: allReports, 
    chartData, 
    getScoreClass,
    formatDateToIST
  });

  await fs.mkdir(path.dirname(htmlFilename), { recursive: true });
  await fs.writeFile(htmlFilename, htmlContent);

  await fs.mkdir(path.dirname(jsonFilename), { recursive: true });
  await fs.writeFile(jsonFilename, JSON.stringify({ report, timestamp }, null, 2));

  return { htmlFilename, jsonFilename };
}

export { formatDateToIST };