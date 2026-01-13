export enum God {
    HOLOBORE = "asceticism",
    VOMITRAX = "decadence",
    GODZAMOK = "ruin",
    CYCLIUS = "ages",
    SELEBRAK = "seasons",
    DOTJEIESS = "creation",
    MURIDAL = "labor",
    JEREMY = "industry",
    MOKALSIUM = "mother",
    SKRUUIA = "scorn",
    RIGIDEL = "order"
}

export const godFromValue = (value: string): keyof typeof God | undefined =>
    (Object.entries(God) as [keyof typeof God, string][])
        .find(([, v]) => v === value)?.[0];