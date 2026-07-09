import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const HeadingOrderRule: Rule = {
    id: 'HEADING_ORDER',
    title: 'Heading levels out of order',
    wcag: '1.3.1',
    severity: 'medium',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const findings: Finding[] = [];

        let lastLevel = 0;

        headings.forEach(heading => {
            const currentLevel = parseInt(heading.tagName.substring(1));
            
            if (lastLevel > 0 && currentLevel > lastLevel + 1) {
                const line = calculateLine(file.content, heading.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: `Heading level skipped: from <h${lastLevel}> to <h${currentLevel}>`,
                    file: file.filePath
                });
            }
            lastLevel = currentLevel;
        });

        return findings;
    }
};
