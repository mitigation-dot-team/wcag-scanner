import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const ButtonNameRule: Rule = {
    id: 'BUTTON_NAME',
    title: 'Button without accessible name',
    wcag: '4.1.2',
    severity: 'high',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const buttons = root.querySelectorAll('button, [role="button"]');
        const findings: Finding[] = [];

        buttons.forEach(button => {
            const hasText = button.textContent.trim().length > 0;
            const hasAriaLabel = button.hasAttribute('aria-label') || button.hasAttribute('aria-labelledby');
            const hasTitle = button.hasAttribute('title');

            if (!hasText && !hasAriaLabel && !hasTitle) {
                const line = calculateLine(file.content, button.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: 'Button or element with role="button" should have an accessible name (text, aria-label, or title)',
                    file: file.filePath
                });
            }
        });

        return findings;
    }
};
