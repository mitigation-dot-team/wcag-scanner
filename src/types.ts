export type Severity = "low" | "medium" | "high" | "critical";

export interface Finding {
    rule: string;
    wcag: string;
    severity: Severity;
    line: number;
    message: string;
    file: string;
}

export interface ParsedFile {
    filePath: string;
    content: string;
    type: "html" | "ts" | "scss";
    ast?: any; // node-html-parser's HTMLElement or TS AST
    templateOffset?: number; // Offset for inline templates in .ts files
}

export interface Rule {
    id: string;
    title: string;
    wcag: string;
    severity: Severity;
    execute(file: ParsedFile): Finding[];
}
