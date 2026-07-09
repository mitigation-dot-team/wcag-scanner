import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

export const LinkTextRule: Rule = {
    id: 'LINK_TEXT',
    title: 'Link without descriptive text',
    wcag: '2.4.4',
    severity: 'high',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const links = root.querySelectorAll('a');
        const findings: Finding[] = [];

        links.forEach(link => {
            const text = link.textContent.trim();
            const hasAriaLabel = link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby');
            const hasTitle = link.hasAttribute('title');
            
            // Check if it contains an image with alt text (also valid for link name)
            const imgs = link.querySelectorAll('img');
            const hasImgWithAlt = imgs.some(img => img.getAttribute('alt')?.trim().length > 0);

            if (!text && !hasAriaLabel && !hasTitle && !hasImgWithAlt) {
                const line = calculateLine(file.content, link.range[0], file.templateOffset);
                findings.push({
                    rule: this.id,
                    wcag: this.wcag,
                    severity: this.severity,
                    line: line,
                    message: 'Links must have discernible text, an aria-label, or an <img> with alt text',
                    file: file.filePath
                });
            }
        });

        return findings;
    }
};
