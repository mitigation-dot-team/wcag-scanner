import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const TabindexRule: Rule = {
    id: 'TABINDEX_POSITIVE',
    title: 'Positive tabindex used',
    wcag: '2.4.3',
    severity: 'medium',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const elements = root.querySelectorAll('[tabindex]');
        const findings: Finding[] = [];

        elements.forEach(el => {
            const tabindex = parseInt(el.getAttribute('tabindex') || '0');
            if (tabindex > 0) {
                const line = calculateLine(file.content, el.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: `Avoid using positive tabindex (${tabindex}). Use 0 or -1 to maintain natural tab order.`,
                    file: file.filePath
                });
            }
        });

        return findings;
    }
};
