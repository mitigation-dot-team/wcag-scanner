import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const DuplicateIdRule: Rule = {
    id: 'DUPLICATE_ID',
    title: 'Duplicate ID detected',
    wcag: '4.1.1',
    severity: 'medium',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const elementsWithId = root.querySelectorAll('[id]');
        const findings: Finding[] = [];
        const idMap = new Map<string, number[]>();

        elementsWithId.forEach(el => {
            const id = el.getAttribute('id');
            if (id) {
                if (!idMap.has(id)) {
                    idMap.set(id, []);
                }
                idMap.get(id)!.push(el.range[0]);
            }
        });

        for (const [id, positions] of idMap.entries()) {
            if (positions.length > 1) {
                // Report all instances of the duplicate ID
                positions.forEach(pos => {
                    const line = calculateLine(file.content, pos, file.templateOffset);
                    findings.push({
                        rule: this.id,
                        wcag: this.wcag,
                        severity: this.severity,
                        line: line,
                        message: `Duplicate ID "${id}" detected. IDs must be unique in the DOM.`,
                        file: file.filePath
                    });
                });
            }
        }

        return findings;
    }
};
