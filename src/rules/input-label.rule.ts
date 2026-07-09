import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const InputLabelRule: Rule = {
    id: 'INPUT_LABEL',
    title: 'Input without label',
    wcag: '3.3.2',
    severity: 'high',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const inputs = root.querySelectorAll('input, select, textarea');
        const findings: Finding[] = [];

        inputs.forEach(input => {
            const type = input.getAttribute('type');
            if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') return;

            const id = input.getAttribute('id');
            const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
            
            let hasLabel = false;
            if (id) {
                const label = root.querySelector(`label[for="${id}"]`);
                if (label) hasLabel = true;
            }

            // Check if input is wrapped in a label
            let parent = input.parentNode;
            while (parent) {
                if ((parent as HTMLElement).tagName === 'LABEL') {
                    hasLabel = true;
                    break;
                }
                parent = parent.parentNode;
            }

            if (!hasLabel && !hasAriaLabel) {
                const line = calculateLine(file.content, input.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: `Input of type "${type || 'text'}" missing associated label or aria-label`,
                    file: file.filePath
                });
            }
        });

        return findings;
    }
};
