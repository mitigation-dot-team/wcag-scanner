import { parse, HTMLElement } from 'node-html-parser';
import type { ParsedFile } from '../types.js';

export function parseHtml(filePath: string, content: string): ParsedFile {
    const root = parse(content, { range: true });
    return {
        filePath,
        content,
        type: 'html',
        ast: root
    };
}
