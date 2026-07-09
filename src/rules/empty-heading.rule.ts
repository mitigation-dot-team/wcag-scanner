import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const EmptyHeadingRule: Rule = {
    id: 'EMPTY_HEADING',
    title: 'Empty heading detected',
    wcag: '1.3.1',
    severity: 'medium',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const findings: Finding[] = [];

        headings.forEach(h => {
            if (h.textContent.trim().length === 0) {
                const line = calculateLine(file.content, h.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: `Empty heading <${h.tagName.toLowerCase()}> detected. Headings must have content.`,
                    file: file.filePath
                });
            }
        });

        return findings;
    }
};
