export interface Upgrade {
    id: number;
    name: string;
    pool: string;
    canBuy(): boolean;
    buy(): void;
    getPrice(): number;
}