import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const RequiredFieldRule: Rule = {
    id: 'REQUIRED_FIELD',
    title: 'Required field missing visible/accessible' + ' indicator',
    wcag: '3.3.2',
    severity: 'low',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const inputs = root.querySelectorAll('input, select, textarea');
        const findings: Finding[] = [];

        inputs.forEach(input => {
            const isRequired = input.hasAttribute('required') || input.getAttribute('aria-required') === 'true';
            
            if (isRequired) {
                const id = input.getAttribute('id');
                let accessibleText = '';

                // Check aria-label
                accessibleText += (input.getAttribute('aria-label') || '').toLowerCase();

                // Check associated labels
                if (id) {
                    const labels = root.querySelectorAll(`label[for="${id}"]`);
                    labels.forEach(l => {
                        accessibleText += l.textContent.toLowerCase();
                    });
                }

                // Check parent label
                let parent = input.parentNode;
                while (parent && parent instanceof HTMLElement) {
                    if (parent.tagName === 'LABEL') {
                        accessibleText += parent.textContent.toLowerCase();
                        break;
                    }
                    parent = parent.parentNode;
                }

                const hasIndicator = accessibleText.includes('*') || 
                                   accessibleText.includes('required') || 
                                   accessibleText.includes('obligatorio');

                if (!hasIndicator) {
                    const line = calculateLine(file.content, input.range[0], file.templateOffset);
                    findings.push({
                        rule: this.id,
                        wcag: this.wcag,
                        severity: this.severity,
                        line: line,
                        message: `Required field might be missing a visible/accessible indicator (e.g., "*" or "required") in its label or aria-label.`,
                        file: file.filePath
                    });
                }
            }
        });

        return findings;
    }
};
