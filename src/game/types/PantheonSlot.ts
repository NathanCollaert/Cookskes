export enum PantheonSlot {
    DIAMOND = 0,
    RUBY = 1,
    JADE = 2
}

export const pantheonSlotFromValue = (value: number): keyof typeof PantheonSlot | undefined =>
    (Object.entries(PantheonSlot) as [keyof typeof PantheonSlot, number][])
        .find(([, v]) => v === value)?.[0];