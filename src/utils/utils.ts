export function calculateLine(content: string, index: number, offset: number = 0): number {
    const sub = content.substring(0, index + offset);
    return sub.split('\n').length;
}
