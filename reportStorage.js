import fs from 'fs/promises';
import path from 'path';

export function formatDateToIST(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const options = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
  
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date Error';
  }
}

export function simplifyFolderName(url) {
  const parsedUrl = new URL(url);
  let folderName = parsedUrl.hostname.replace(/^www\./, '').split('.')[0];
  
  if (parsedUrl.pathname !== '/') {
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    folderName += pathParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  }
  
  return folderName;
}

export function getBaseDir(customDir) {
  return customDir || 'lighthouse-test-output';
}

export async function getReportDir(url, customDir) {
  const folderName = simplifyFolderName(url);
  return path.join(getBaseDir(customDir), folderName);
}

export async function storeReport(url, scores, fullReport, customDir) {
  const reportDir = await getReportDir(url, customDir);
  const timestamp = new Date().toISOString();
  const filename = `report-${timestamp.replace(/:/g, '-')}.json`;

  await fs.mkdir(path.join(reportDir, 'json'), { recursive: true });
  await fs.writeFile(
    path.join(reportDir, 'json', filename),
    JSON.stringify({ timestamp, scores, fullReport }, null, 2)
  );
}

export async function getLatestReports(url, limit = 5, customDir) {
  const reportDir = await getReportDir(url, customDir);
  const jsonDir = path.join(reportDir, 'json');

  try {
    const files = await fs.readdir(jsonDir);
    const reports = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await fs.readFile(path.join(jsonDir, file), 'utf-8');
          const report = JSON.parse(content);
          // Always use the timestamp from the filename
          const filenameTimestamp = file.match(/report-(.+)\.json/)[1].replace(/-/g, ':');
          return { ...report, timestamp: filenameTimestamp };
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out invalid reports (those with all zero scores or invalid dates)
    const validReports = reports.filter(report => 
      report && report.scores && 
      Object.values(report.scores).some(score => score > 0) &&
      !isNaN(new Date(report.timestamp).getTime())
    );

    validReports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return validReports.slice(0, limit);
  } catch (error) {
    console.error('Error reading reports:', error);
    return [];
  }
}