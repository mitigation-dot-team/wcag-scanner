import { parse, HTMLElement } from 'node-html-parser';
import type { ParsedFile } from '../types.js';

export function parseHtml(filePath: string, content: string): ParsedFile {
    // node-html-parser version in this project does not accept a `range` option.
    // Parse without that option to remain compatible with the installed version.
    const root = parse(content);
    return {
        filePath,
        content,
        type: 'html',
        ast: root
    };
}
