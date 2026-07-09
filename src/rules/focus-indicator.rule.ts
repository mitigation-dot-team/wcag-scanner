import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const FocusIndicatorRule: Rule = {
    id: 'FOCUS_INDICATOR',
    title: 'Focus indicator removed with style',
    wcag: '2.4.7',
    severity: 'high',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const allElements = root.querySelectorAll('*');
        const findings: Finding[] = [];

        allElements.forEach(el => {
            const style = el.getAttribute('style');
            if (style) {
                // Check if outline is explicitly removed
                const hasOutlineNone = /outline\s*:\s*(none|0|transparent)/i.test(style);
                
                if (hasOutlineNone) {
                    const line = calculateLine(file.content, el.range[0], file.templateOffset);
                    findings.push({
                        rule: this.id,
                        wcag: this.wcag,
                        severity: this.severity,
                        line: line,
                        message: `Potential violation of WCAG 2.4.7: Focus indicator might be removed by "outline: none" style.`,
                        file: file.filePath
                    });
                }
            }
        });

        return findings;
    }
};
