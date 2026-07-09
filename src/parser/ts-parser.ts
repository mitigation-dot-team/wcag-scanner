import { parseHtml } from './html-parser.js';
import type { ParsedFile } from '../types.js';

export function parseTs(filePath: string, content: string): ParsedFile[] {
    // Basic regex to find inline templates in Angular components
    // template: `...`
    const templateRegex = /template\s*:\s*`([\s\S]*?)`/g;
    let match;
    const components: ParsedFile[] = [];

    while ((match = templateRegex.exec(content)) !== null) {
        const templateContent = match[1];
        // We use the full content for line calculation in the engine, 
        // but the rule's execute expects a ParsedFile with an AST.
        // For inline templates, line calculation is tricky because we need the offset.
        
        const htmlParsed = parseHtml(filePath, templateContent);
        // Adjust the range of all nodes in the AST if needed? 
        // node-html-parser's range is relative to the provided string.
        // We need an offset.
        
        components.push({
            ...htmlParsed,
            type: 'html', // It's HTML content inside a TS file
            content: content, // We keep the full file content for context
            templateOffset: match.index + match[0].indexOf(templateContent)
        });
    }

    return components;
}

export interface TsParsedFile extends ParsedFile {
    templateOffset?: number;
}
