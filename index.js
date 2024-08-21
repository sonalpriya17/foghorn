#!/usr/bin/env bun

import { Command } from 'commander';
import { runLighthouse } from './lighthouseRunner.js';
import { generateReports } from './reportGenerator.js';

const program = new Command();

program
  .name('foghorn')
  .description('A CLI tool to generate, compare, and analyze Lighthouse reports')
  .version('1.1.0')
  .option('-u, --url <type>', 'URL to analyze', 'https://leetcode.com/')
  .option('-o, --output <directory>', 'Output directory for test reports', 'lighthouse-test-output')
  .option('--chrome-flags <flags>', 'Flags to pass to Chrome', '--headless --no-sandbox')
  .action(async (options) => {
    try {
      const { url, output, chromeFlags } = options;
      const { scores, fullReport, comparisonData } = await runLighthouse(url, output, chromeFlags);
      console.log('Lighthouse Scores:', scores);
      const { htmlFilename, jsonFilename } = await generateReports(url, { scores, fullReport }, comparisonData, output);
      console.log(`\nHTML report generated: ${htmlFilename}`);
      console.log(`JSON report generated: ${jsonFilename}`);
    } catch (error) {
      console.error('Error running Lighthouse:', error);
    }
  });

program.parse(process.argv);