import { describe, it, expect } from 'vitest';
import { ImgAltRule } from '../src/rules/img-alt.rule.js';
import { parseHtml } from '../src/parser/html-parser.js';

describe('ImgAltRule', () => {
    it('should find images without alt attribute', () => {
        const html = '<img src="test.png">';
        const parsed = parseHtml('test.html', html);
        const findings = ImgAltRule.execute(parsed);
        expect(findings.length).toBe(1);
        expect(findings[0]!.rule).toBe('IMG_ALT');
    });

    it('should not find images with alt attribute', () => {
        const html = '<img src="test.png" alt="description">';
        const parsed = parseHtml('test.html', html);
        const findings = ImgAltRule.execute(parsed);
        expect(findings.length).toBe(0);
    });

    it('should ignore alt if empty (WCAG permits empty alt for decorative)', () => {
        // Technically WCAG 1.1.1 allows alt="" for decorative images.
        // My current rule just checks for presence of attribute.
        const html = '<img src="test.png" alt="">';
        const parsed = parseHtml('test.html', html);
        const findings = ImgAltRule.execute(parsed);
        expect(findings.length).toBe(0);
    });
});
