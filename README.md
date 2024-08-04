# Foghorn

## Lighthouse Report Generator

This project generates Lighthouse reports for specified URLs and provides a comparison with previous reports.

### Prerequisites

- [Bun](https://bun.sh/) (v1.1.21 or later)
- Node.js (v14 or later, for Lighthouse)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lighthouse-report-generator.git
   cd lighthouse-report-generator
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Usage

To generate a Lighthouse report for a URL:
```
bun index.js -u https://example.com
```



Replace `https://example.com` with the URL you want to analyze.

## Project Structure

- `index.js`: Main entry point of the application
- `reportGenerator.js`: Handles report generation and comparison
- `reportStorage.js`: Manages storage and retrieval of reports
- `templates/report.ejs`: EJS template for the HTML report

## Configuration

You can modify the following files to customize the report generation:

- `reportStorage.js`: Adjust the `BASE_DIR` constant to change the directory where reports are stored
- `templates/report.ejs`: Modify the HTML template to change the report layout

## Output

The script generates two files for each run:

1. An HTML report: `test-output/<domain>/html/report-<timestamp>.html`
2. A JSON report: `test-output/<domain>/json/report-<timestamp>.json`

The HTML report includes:
- Current scores
- A comparison chart of the last 5 reports
- A table comparing the last 5 reports

## Troubleshooting

If you encounter any issues:

1. Ensure you have the latest version of Bun installed
2. Check that all dependencies are correctly installed
3. Verify that you have the necessary permissions to write to the `test-output` directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.