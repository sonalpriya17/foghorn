import fs from 'fs/promises';
import path from 'path';
import { REPORTS_DIR } from './reportStorage.js';

export async function compareReports() {
  const files = await fs.readdir(REPORTS_DIR);
  const sortedFiles = files.sort().reverse().slice(0, 5);
  const reports = await Promise.all(
    sortedFiles.map(file => fs.readFile(path.join(REPORTS_DIR, file), 'utf-8').then(JSON.parse))
  );

  return reports.map(report => ({
    scores: report.scores,
    timestamp: report.timestamp
  }));
}