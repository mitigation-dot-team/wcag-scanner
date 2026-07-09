import { describe, it, expect } from 'vitest';
import { IframeTitleRule } from '../src/rules/iframe-title.rule.js';
import { TableHeaderRule } from '../src/rules/table-header.rule.js';
import { parseHtml } from '../src/parser/html-parser.js';

describe('IframeTitleRule', () => {
    it('should find iframes without title', () => {
        const html = '<iframe src="test.html"></iframe>';
        const parsed = parseHtml('test.html', html);
        const findings = IframeTitleRule.execute(parsed);
        expect(findings.length).toBe(1);
        expect(findings[0].message).toContain('iframes must have a non-empty title');
    });

    it('should not find issues with titled iframes', () => {
        const html = '<iframe src="test.html" title="Interactive Map"></iframe>';
        const parsed = parseHtml('test.html', html);
        const findings = IframeTitleRule.execute(parsed);
        expect(findings.length).toBe(0);
    });
});

describe('TableHeaderRule', () => {
    it('should find tables without headers or caption', () => {
        const html = '<table><tr><td>Data</td></tr></table>';
        const parsed = parseHtml('test.html', html);
        const findings = TableHeaderRule.execute(parsed);
        expect(findings.length).toBe(1);
    });

    it('should pass if table has th', () => {
        const html = '<table><tr><th>Header</th></tr><tr><td>Data</td></tr></table>';
        const parsed = parseHtml('test.html', html);
        const findings = TableHeaderRule.execute(parsed);
        expect(findings.length).toBe(0);
    });

    it('should pass if table has caption', () => {
        const html = '<table><caption>Title</caption><tr><td>Data</td></tr></table>';
        const parsed = parseHtml('test.html', html);
        const findings = TableHeaderRule.execute(parsed);
        expect(findings.length).toBe(0);
    });
});
