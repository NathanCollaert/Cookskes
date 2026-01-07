export const range = (from: number, to: number): number[] =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const arraysEqualUnordered = (a: number[], b: number[]): boolean => {
    if (a.length !== b.length) return false;

    const count = new Map<number, number>();

    for (const n of a) {
        count.set(n, (count.get(n) ?? 0) + 1);
    }

    for (const n of b) {
        const c = count.get(n);
        if (!c) return false;
        c === 1 ? count.delete(n) : count.set(n, c - 1);
    }

    return count.size === 0;
}

export function hasAll(source: any[], required: any[]): boolean {
    return required.every(v => source.includes(v));
}