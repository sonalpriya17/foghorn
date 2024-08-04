import fs from 'fs/promises';
import path from 'path';

const BASE_DIR = 'test-output';

export function formatDateToIST(dateString) {
  try {
    if (!dateString) {
      return 'No Date';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const options = {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
  
    const formatter = new Intl.DateTimeFormat('en-IN', options);
    const parts = formatter.formatToParts(date);
    
    const day = parts.find(part => part.type === 'day')?.value;
    const month = parts.find(part => part.type === 'month')?.value;
    const hour = parts.find(part => part.type === 'hour')?.value;
    const minute = parts.find(part => part.type === 'minute')?.value;
    const dayPeriod = parts.find(part => part.type === 'dayPeriod')?.value;

    if (!day || !month || !hour || !minute || !dayPeriod) {
      return 'Incomplete Date';
    }

    return `${day}${month}_${hour}:${minute}${dayPeriod.toLowerCase()}`;
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

export async function getReportDir(url) {
  const folderName = simplifyFolderName(url);
  return path.join(BASE_DIR, folderName);
}

export async function storeReport(url, scores, fullReport) {
  const reportDir = await getReportDir(url);
  const timestamp = new Date().toISOString();
  const filename = `report-${timestamp}.json`;

  await fs.mkdir(path.join(reportDir, 'json'), { recursive: true });
  await fs.writeFile(
    path.join(reportDir, 'json', filename),
    JSON.stringify({ timestamp, scores, fullReport }, null, 2)
  );
}

export async function getLatestReports(url, limit = 5) {
  const reportDir = await getReportDir(url);
  const jsonDir = path.join(reportDir, 'json');

  try {
    const files = await fs.readdir(jsonDir);
    const reports = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(jsonDir, file), 'utf-8');
        return JSON.parse(content);
      })
    );

    reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return reports.slice(0, limit);
  } catch (error) {
    console.error('Error reading reports:', error);
    return [];
  }
}
