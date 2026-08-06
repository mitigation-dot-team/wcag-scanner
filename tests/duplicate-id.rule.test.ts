import { describe, it, expect } from 'vitest';
import { DuplicateIdRule } from '../src/rules/duplicate-id.rule.js';
import { parseHtml } from '../src/parser/html-parser.js';

describe('DuplicateIdRule', () => {
    it('should find duplicate IDs', () => {
        const html = '<div id="test"></div><span id="test"></span>';
        const parsed = parseHtml('test.html', html);
        const findings = DuplicateIdRule.execute(parsed);
        expect(findings.length).toBe(2);
        expect(findings[0]!.message).toContain('Duplicate ID "test"');
    });

    it('should not find issues with unique IDs', () => {
        const html = '<div id="test1"></div><span id="test2"></span>';
        const parsed = parseHtml('test.html', html);
        const findings = DuplicateIdRule.execute(parsed);
        expect(findings.length).toBe(0);
    });
});
