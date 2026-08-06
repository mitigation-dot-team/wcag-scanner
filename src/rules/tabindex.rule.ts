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
            const rawTabindex = el.getAttribute('tabindex');
            const tabindex = parseInt(rawTabindex || '0');
            if (tabindex > 0) {
                const line = calculateLine(file.content, el.range[0], file.templateOffset);
                
                // Construct fix: find tabindex="X" or tabindex='X' or tabindex=X
                const elRaw = el.outerHTML;
                const tabindexRegex = /tabindex=(['"]?)(\d+)\1/;
                const match = elRaw.match(tabindexRegex);
                
                let fix;
                if (match) {
                    const matchStart = match.index!;
                    const matchEnd = matchStart + match[0].length;
                    const offset = file.templateOffset || 0;
                    fix = {
                        range: [el.range[0] + matchStart + offset, el.range[0] + matchEnd + offset] as [number, number],
                        replacement: `tabindex="0"`
                    };
                }

                const finding: Finding = {
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: `Avoid using positive tabindex (${tabindex}). Use 0 or -1 to maintain natural tab order.`,
                    file: file.filePath
                };
                if (fix) finding.fix = fix;
                findings.push(finding);
            }
        });

        return findings;
    }
};
