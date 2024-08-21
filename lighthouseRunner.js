import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { storeReport, getLatestReports } from './reportStorage.js';

export async function runLighthouse(url = 'https://leetcode.com/', outputDir) {
  let chrome;
  try {
    console.log('Launching Chrome...');
    chrome = await launch({ chromeFlags: ['--headless'] });
    console.log('Chrome launched successfully');

    if (outputDir) {
      console.log(`Output directory: ${outputDir}`);
    }

    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
      port: chrome.port,
    };

    console.log(`Running Lighthouse for URL: ${url}`);
    const runnerResult = await lighthouse(url, options);

    if (!runnerResult) {
      throw new Error('Lighthouse runner result is undefined');
    }

    console.log('Lighthouse run completed, parsing results...');
    const report = JSON.parse(runnerResult.report);
    const scores = {
      performance: Math.round((report.categories.performance?.score || 0) * 100),
      accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
      seo: Math.round((report.categories.seo?.score || 0) * 100),
      bestPractices: Math.round((report.categories['best-practices']?.score || 0) * 100),
    };

    console.log('Lighthouse Scores:', scores);

    await storeReport(url, scores, report, outputDir);
    const comparisonData = await getLatestReports(url, 5, outputDir);

    return {
      scores,
      fullReport: report,
      comparisonData,
    };
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    throw error;
  } finally {
    if (chrome) {
      console.log('Attempting to close Chrome...');
      try {
        await chrome.kill();
        console.log('Chrome closed successfully');
      } catch (error) {
        console.error('Error closing Chrome:', error);
      }
    }
  }
}