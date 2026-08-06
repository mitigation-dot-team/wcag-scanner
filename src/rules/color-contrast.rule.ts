import type { Rule, ParsedFile, Finding } from '../types.js';
import { HTMLElement } from 'node-html-parser';
import { calculateLine } from '../utils/utils.js';

function getColor(style: string, property: string): string | null {
    const prop = property.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    const regex = new RegExp(`${prop}\\s*:\\s*(#[0-9a-f]{3,6})`, 'i');
    const match = style.match(regex);
    return match && match[1] ? match[1] : null;
}

function getLuminance(hex: string): number {
    // Validate hex format: either #RGB or #RRGGBB
    const match = hex && hex.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!match) return 0;

    let r: number, g: number, b: number;
    if (hex.length === 4) {
        // Use substring to avoid indexing possibly undefined characters
        const rHex = hex.substring(1, 2);
        const gHex = hex.substring(2, 3);
        const bHex = hex.substring(3, 4);
        r = parseInt(rHex + rHex, 16);
        g = parseInt(gHex + gHex, 16);
        b = parseInt(bHex + bHex, 16);
    } else {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }

    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }) as [number, number, number];
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrast(hex1: string, hex2: string): number {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
}

export const ColorContrastRule: Rule = {
    id: 'COLOR_CONTRAST',
    title: 'Hardcoded color contrast check',
    wcag: '1.4.3',
    severity: 'medium',

    execute(file: ParsedFile): Finding[] {
        if (file.type !== 'html') return [];
        const root = file.ast as HTMLElement;
        const allElements = root.querySelectorAll('*');
        const findings: Finding[] = [];

        allElements.forEach(el => {
            const style = el.getAttribute('style');
            if (style) {
                const fg = getColor(style, 'color');
                const bg = getColor(style, 'background-color');

                if (fg && bg) {
                    const contrast = calculateContrast(fg, bg);
                    // Standard is 4.5:1 for normal text
                    if (contrast < 4.5) {
                        const line = calculateLine(file.content, el.range[0], file.templateOffset);
                        findings.push({
                            rule: this.id,
                            wcag: this.wcag,
                            severity: this.severity,
                            line: line,
                            message: `Low contrast ratio (${contrast.toFixed(2)}:1) detected in style attribute. Minimum required is 4.5:1.`,
                            file: file.filePath
                        });
                    }
                }
            }
        });

            return findings;
        }
    };
