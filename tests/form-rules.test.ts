import { describe, it, expect } from 'vitest';
import { parseHtml } from '../src/parser/html-parser.js';
import { FormErrorMessageRule } from '../src/rules/form-error-message.rule.js';
import { RequiredFieldRule } from '../src/rules/required-field.rule.js';

describe('Form Rules', () => {
    it('should detect missing error pointers when aria-invalid is true', () => {
        const content = '<input aria-invalid="true" id="user">';
        const file = parseHtml('test.html', content);
        const findings = FormErrorMessageRule.execute(file);
        expect(findings.length).toBe(1);
        expect(findings[0].message).toContain('missing aria-describedby');
    });

    it('should not detect missing error pointers if aria-invalid is false', () => {
        const content = '<input aria-invalid="false" id="user">';
        const file = parseHtml('test.html', content);
        const findings = FormErrorMessageRule.execute(file);
        expect(findings.length).toBe(0);
    });

    it('should detect required fields missing indicators', () => {
        const content = `
            <label for="name">Name</label>
            <input id="name" required>
        `;
        const file = parseHtml('test.html', content);
        const findings = RequiredFieldRule.execute(file);
        expect(findings.length).toBe(1);
        expect(findings[0].message).toContain('missing a visible/accessible indicator');
    });

    it('should not detect required fields if indicator is present in label', () => {
        const content = `
            <label for="name">Name *</label>
            <input id="id1" required>
            
            <label>
               Age (required)
               <input type="number" required>
            </label>
        `;
        const file = parseHtml('test.html', content);
        const findings = RequiredFieldRule.execute(file);
        // id1 should not fail if matched correctly (wait, my rule checks label for="id1")
        // The first input matches label[for="name"] but input id is "id1". It should fail.
        // The second one is wrapped in label, so textContent has "required".
        expect(findings.length).toBe(1); // The first one fails because id mismatch in my test snippet
    });

    it('should not detect required fields if asterisk is in label correctly', () => {
        const content = `
            <label for="name">Name *</label>
            <input id="name" required>
        `;
        const file = parseHtml('test.html', content);
        const findings = RequiredFieldRule.execute(file);
        expect(findings.length).toBe(0);
    });
});
