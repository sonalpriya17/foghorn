#!/usr/bin/env bun

import { Command } from 'commander';
import { runLighthouse } from './lighthouseRunner.js';
import { generateReports } from './reportGenerator.js';

const program = new Command();

program
  .version('1.0.0')
  .description('Foghorn: Analyze Lighthouse reports and generate insights')
  .option('-u, --url <type>', 'URL to analyze', 'https://leetcode.com/');

program.parse(process.argv);

const options = program.opts();

async function main() {
  try {
    console.log('Running Lighthouse for:', options.url);
    const { scores, fullReport, comparisonData } = await runLighthouse(options.url);
    
    console.log('Lighthouse Report:');
    console.log(`Performance: ${scores.performance}`);
    console.log(`Accessibility: ${scores.accessibility}`);
    console.log(`SEO: ${scores.seo}`);
    console.log(`Best Practices: ${scores.bestPractices}`);

    const { htmlFilename, jsonFilename } = await generateReports(options.url, { scores, fullReport }, comparisonData);
    console.log(`\nHTML report generated: ${htmlFilename}`);
    console.log(`JSON report generated: ${jsonFilename}`);
  } catch (error) {
    console.error('Error running Lighthouse:', error);
  } finally {
    console.log('Exiting...');
    process.exit(0);
  }
}

main();