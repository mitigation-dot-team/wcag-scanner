import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

const VALID_ARIA_ATTRS = new Set([
    'aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-busy', 'aria-checked',
    'aria-colcount', 'aria-colindex', 'aria-colspan', 'aria-controls', 'aria-current',
    'aria-describedby', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage',
    'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden',
    'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level',
    'aria-live', 'aria-modal', 'aria-multiline', 'aria-multiselectable', 'aria-orientation',
    'aria-owns', 'aria-placeholder', 'aria-posinset', 'aria-pressed', 'aria-readonly',
    'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowcount', 'aria-rowindex',
    'aria-rowspan', 'aria-selected', 'aria-setsize', 'aria-sort', 'aria-valuemax',
    'aria-valuemin', 'aria-valuenow', 'aria-valuetext'
]);

export const AriaValidAttrRule: Rule = {
    id: 'ARIA_VALID_ATTR',
    title: 'Invalid aria-* attribute',
    wcag: '4.1.2',
    severity: 'medium',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const allElements = root.querySelectorAll('*');
        const findings: Finding[] = [];

        allElements.forEach(el => {
            const attrs = el.rawAttributes;
            for (const attrName in attrs) {
                if (attrName.startsWith('aria-') && !VALID_ARIA_ATTRS.has(attrName)) {
                    // Check for common typos or invalid names
                    const line = calculateLine(file.content, el.range[0], file.templateOffset);
                    findings.push({
                        rule: this.id,
                        wcag: this.wcag,
                        severity: this.severity,
                        line: line,
                        message: `Invalid or misspelled ARIA attribute: "${attrName}"`,
                        file: file.filePath
                    });
                }
            }
        });

        return findings;
    }
};
