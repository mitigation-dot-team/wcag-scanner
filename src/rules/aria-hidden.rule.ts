import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const AriaHiddenRule: Rule = {
    id: 'ARIA_HIDDEN_INTERACTIVE',
    title: 'Aria-hidden on interactive element',
    wcag: '4.1.2',
    severity: 'critical',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'DETAILS'];
        const findings: Finding[] = [];

        const checkNode = (node: HTMLElement) => {
            const isInteractive = interactiveTags.includes(node.tagName) || node.hasAttribute('tabindex');
            const isHidden = node.getAttribute('aria-hidden') === 'true';

            if (isInteractive && isHidden) {
                const line = calculateLine(file.content, node.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: `Interactive element <${node.tagName.toLowerCase()}> should not have aria-hidden="true"`,
                    file: file.filePath
                });
            }

            node.childNodes.forEach(child => {
                if (child instanceof HTMLElement) {
                    checkNode(child);
                }
            });
        };

        root.childNodes.forEach(child => {
            if (child instanceof HTMLElement) {
                checkNode(child);
            }
        });

        return findings;
    }
};
