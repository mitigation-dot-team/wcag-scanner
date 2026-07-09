import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const ImgAltRule: Rule = {
    id: 'IMG_ALT',
    title: 'Missing alt attribute',
    wcag: '1.1.1',
    severity: 'high',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const imgs = root.querySelectorAll('img');
        const findings: Finding[] = [];

        imgs.forEach(img => {
            if (!img.hasAttribute('alt')) {
                const line = calculateLine(file.content, img.range[0], file.templateOffset);
                
                const offset = file.templateOffset || 0;
                const fix = {
                    range: [img.range[0] + 4 + offset, img.range[0] + 4 + offset] as [number, number],
                    replacement: ' alt=""'
                };

                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: 'Missing alt attribute on <img> tag',
                    file: file.filePath,
                    fix
                });
            }
        });

        return findings;
    }
};
