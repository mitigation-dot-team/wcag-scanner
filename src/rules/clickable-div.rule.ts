import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const ClickableDivRule: Rule = {
    id: 'CLICKABLE_DIV',
    title: 'Clickable non-interactive element',
    wcag: '2.1.1',
    severity: 'critical',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        // In Angular, look for (click) or [click]
        const allElements = root.querySelectorAll('*');
        const findings: Finding[] = [];

        const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'DETAILS', 'SUMMARY'];

        allElements.forEach(el => {
            const hasClick = el.hasAttribute('(click)') || el.hasAttribute('[click]') || el.hasAttribute('onclick');
            const isNonInteractive = !interactiveTags.includes(el.tagName);

            if (hasClick && isNonInteractive) {
                const hasTabindex = el.hasAttribute('tabindex');
                const hasRole = el.hasAttribute('role');

                if (!hasTabindex || !hasRole) {
                    const line = calculateLine(file.content, el.range[0], file.templateOffset);
                    findings.push({
                        rule: this.id,
                        wcag: this.wcag,
                        severity: this.severity,
                        line: line,
                        message: `Non-interactive element <${el.tagName.toLowerCase()}> with (click) handler missing role and/or tabindex`,
                        file: file.filePath
                    });
                }
            }
        });

        return findings;
    }
};
