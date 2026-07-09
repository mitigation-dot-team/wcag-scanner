import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const IframeTitleRule: Rule = {
    id: 'IFRAME_TITLE',
    title: 'Iframe without title',
    wcag: '4.1.2',
    severity: 'medium',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const iframes = root.querySelectorAll('iframe');
        const findings: Finding[] = [];

        iframes.forEach(iframe => {
            const title = iframe.getAttribute('title');
            if (!title || title.trim().length === 0) {
                const line = calculateLine(file.content, iframe.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: 'iframes must have a non-empty title attribute to describe their content',
                    file: file.filePath
                });
            }
        });

        return findings;
    }
};
