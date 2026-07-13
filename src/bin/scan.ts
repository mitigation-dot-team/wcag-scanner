import { Command } from 'commander';
import { glob } from 'glob';
import { Engine } from '../engine.js';
import { ALL_RULES } from '../rules/index.js';
import { Reporter } from '../reporter.js';

const program = new Command();

program
    .name('wcag-scanner')
    .description('CLI to scan Angular files for WCAG 2.2 accessibility issues')
    .version('1.0.0')
    .argument('<path>', 'file or glob pattern to scan')
    .option('-j, --json', 'output in JSON format')
    .option('--fix', 'automatically fix some accessibility issues', false)
    .option('--api-key <key>', 'Mitigation API Key')
    .action(async (path: string, options) => {
        if (!options.apiKey) {
            console.error('Error: Mitigation API Key is required. Get yours at https://mitigation.team');
            process.exit(1);
        }

        const engine = new Engine();
        ALL_RULES.forEach(rule => engine.registerRule(rule));

        try {
            const files = await glob(path);
            if (files.length === 0) {
                console.error(`No files found matching: ${path}`);
                process.exit(1);
            }

            const findings = await engine.run(files, options.fix);

            if (options.json) {
                Reporter.reportJson(findings);
            } else {
                Reporter.report(findings);
            }

            if (findings.length > 0) {
                process.exit(1);
            }
        } catch (error) {
            console.error('Error during scan:', error);
            process.exit(1);
        }
    });

program.parse();
