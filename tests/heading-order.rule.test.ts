import { describe, it, expect } from 'vitest';
import { HeadingOrderRule } from '../src/rules/heading-order.rule.js';
import { parseHtml } from '../src/parser/html-parser.js';

describe('HeadingOrderRule', () => {
    it('should find skipped heading levels', () => {
        const html = '<h1>Title</h1><h3>Subtitle</h3>';
        const parsed = parseHtml('test.html', html);
        const findings = HeadingOrderRule.execute(parsed);
        expect(findings.length).toBe(1);
        expect(findings[0]!.message).toContain('from <h1> to <h3>');
    });

    it('should not find issues with correct order', () => {
        const html = '<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>';
        const parsed = parseHtml('test.html', html);
        const findings = HeadingOrderRule.execute(parsed);
        expect(findings.length).toBe(0);
    });
});
