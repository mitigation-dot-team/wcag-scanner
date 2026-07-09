import { describe, it, expect } from 'vitest';
import { parseHtml } from '../src/parser/html-parser.js';
import { FocusIndicatorRule } from '../src/rules/focus-indicator.rule.js';
import { ColorContrastRule } from '../src/rules/color-contrast.rule.js';

describe('Style-based Rules', () => {
    it('should detect outline: none', () => {
        const content = '<button style="outline: none">Click me</button>';
        const file = parseHtml('test.html', content);
        const findings = FocusIndicatorRule.execute(file);
        expect(findings.length).toBe(1);
    });

    it('should detect low contrast in style', () => {
        // Light grey on white
        const content = '<div style="color: #ccc; background-color: #fff">Low contrast</div>';
        const file = parseHtml('test.html', content);
        const findings = ColorContrastRule.execute(file);
        expect(findings.length).toBe(1);
        expect(findings[0].message).toContain('Low contrast ratio');
    });

    it('should not detect high contrast', () => {
        // Black on white
        const content = '<div style="color: #000; background-color: #fff">High contrast</div>';
        const file = parseHtml('test.html', content);
        const findings = ColorContrastRule.execute(file);
        expect(findings.length).toBe(0);
    });
});
