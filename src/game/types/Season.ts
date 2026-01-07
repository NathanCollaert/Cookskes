export enum Season {
    CHRISTMAS = "Festive biscuit",
    HALLOWEEN = "Ghostly biscuit",
    VALENTINES = "Lovestick biscuit",
    FOOLS = "Fool's biscuit",
    EASTER = "Bunny biscuit"
}

export const seasonFromValue = (value: string): keyof typeof Season | undefined =>
    (Object.entries(Season) as [keyof typeof Season, string][])
        .find(([, v]) => v === value)?.[0];