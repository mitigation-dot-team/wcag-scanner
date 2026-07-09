import * as fs from 'fs';
import type { ParsedFile, Rule, Finding } from './types.js';
import { parseHtml } from './parser/html-parser.js';
import { parseTs } from './parser/ts-parser.js';

export class Engine {
    private rules: Rule[] = [];

    constructor() {}

    registerRule(rule: Rule) {
        this.rules.push(rule);
    }

    async run(filePaths: string[]): Promise<Finding[]> {
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

            for (const parsedFile of parsedFiles) {
                for (const rule of this.rules) {
                    const findings = rule.execute(parsedFile);
                    allFindings = [...allFindings, ...findings];
                }
            }
        }

        return allFindings;
    }
}
