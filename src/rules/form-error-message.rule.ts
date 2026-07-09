import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const FormErrorMessageRule: Rule = {
    id: 'FORM_ERROR_MESSAGE',
    title: 'Form control missing accessible error message',
    wcag: '3.3.1',
    severity: 'medium',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const inputs = root.querySelectorAll('input, select, textarea');
        const findings: Finding[] = [];

        inputs.forEach(input => {
            const ariaInvalid = input.getAttribute('aria-invalid');
            const hasErrorPointer = input.getAttribute('aria-describedby') || input.getAttribute('aria-errormessage');

            // If aria-invalid is set (even if it's a binding like [aria-invalid]="..."),
            // it's good practice to have a describedby or errormessage.
            // In static analysis, if we see the attribute aria-invalid="true", we definitely expect a pointer.
            if (ariaInvalid === 'true' && !hasErrorPointer) {
                const line = calculateLine(file.content, input.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: `Input with aria-invalid="true" is missing aria-describedby or aria-errormessage to link to the error message.`,
                    file: file.filePath
                });
            }
        });

        return findings;
    }
};
