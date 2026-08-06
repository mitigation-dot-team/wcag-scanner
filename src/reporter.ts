import type { Finding } from './types.js';

export class Reporter {
    static report(findings: Finding[]) {
        if (findings.length === 0) {
            console.log("\x1b[32m%s\x1b[0m", "✔ No accessibility issues found!");
            return;
        }

        const groupedByFile = findings.reduce((acc, finding) => {
            const file = finding.file;
            const list = acc[file] ?? (acc[file] = []);
            list.push(finding);
            return acc;
        }, {} as Record<string, Finding[]>);

        for (const [file, fileFindings] of Object.entries(groupedByFile)) {
            console.log(`\n\x1b[4m${file}\x1b[0m`);
            fileFindings.sort((a, b) => a.line - b.line).forEach(f => {
                const color = f.severity === 'critical' ? '\x1b[31m' : f.severity === 'high' ? '\x1b[33m' : '\x1b[37m';
                console.log(`${color}✖ WCAG ${f.wcag}\x1b[0m`);
                console.log(`  ${f.message}`);
                console.log(`  Line ${f.line}\n`);
            });
        }

        console.log(`\x1b[31m%s\x1b[0m`, `Total findings: ${findings.length}`);
    }

    static reportJson(findings: Finding[]) {
        console.log(JSON.stringify(findings, null, 2));
    }
}
