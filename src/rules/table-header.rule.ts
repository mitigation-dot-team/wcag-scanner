import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const TableHeaderRule: Rule = {
    id: 'TABLE_HEADER',
    title: 'Table without headers',
    wcag: '1.3.1',
    severity: 'medium',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const tables = root.querySelectorAll('table');
        const findings: Finding[] = [];

        tables.forEach(table => {
            const hasTh = table.querySelector('th') !== null;
            const hasCaption = table.querySelector('caption') !== null;

            if (!hasTh && !hasCaption) {
                const line = calculateLine(file.content, table.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: 'Tables should have header cells (<th>) or a <caption> to describe the data structure',
                    file: file.filePath
                });
            }
        });

        return findings;
    }
};
