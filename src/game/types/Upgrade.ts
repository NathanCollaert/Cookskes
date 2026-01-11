export interface Upgrade {
    id: number;
    name: string;
    pool: string;
    canBuy(): boolean;
    buy(byPass?: boolean): void;
    getPrice(): number;
}