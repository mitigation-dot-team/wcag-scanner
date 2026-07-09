import * as fs from 'fs';
import type { ParsedFile, Rule, Finding, Fix } from './types.js';
import { parseHtml } from './parser/html-parser.js';
import { parseTs } from './parser/ts-parser.js';

export class Engine {
    private rules: Rule[] = [];

    constructor() {}

    registerRule(rule: Rule) {
        this.rules.push(rule);
    }

    async run(filePaths: string[], fix: boolean = false): Promise<Finding[]> {
        let allFindings: Finding[] = [];

        for (const path of filePaths) {
            if (!fs.existsSync(path)) continue;

            const content = fs.readFileSync(path, 'utf-8');
            let parsedFiles: ParsedFile[] = [];

            if (path.endsWith('.html')) {
                parsedFiles = [parseHtml(path, content)];
            } else if (path.endsWith('.ts')) {
                parsedFiles = parseTs(path, content);
            } else {
                continue;
            }

            const findingsForFile: Finding[] = [];
            for (const parsedFile of parsedFiles) {
                for (const rule of this.rules) {
                    const findings = rule.execute(parsedFile);
                    findingsForFile.push(...findings);
                }
            }

            if (fix) {
                const fixes = findingsForFile
                    .filter(f => f.fix)
                    .map(f => f.fix!)
                    .filter(f => f.range[0] >= 0);

                if (fixes.length > 0) {
                    const newContent = this.applyFixes(content, fixes);
                    fs.writeFileSync(path, newContent, 'utf-8');
                }
            }

            allFindings = [...allFindings, ...findingsForFile];
        }

        return allFindings;
    }

    private applyFixes(content: string, fixes: Fix[]): string {
        const sortedFixes = [...fixes].sort((a, b) => b.range[0] - a.range[0]);
        let newContent = content;

        for (const f of sortedFixes) {
            newContent = newContent.slice(0, f.range[0]) + f.replacement + newContent.slice(f.range[1]);
        }

        return newContent;
    }
}
