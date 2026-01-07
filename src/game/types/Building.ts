export interface Building {
    id: number;
    name: string;
    amount: number;
    price: number;
    storedCps: number;
    buy(qty: number): void;
    tooltip(): string;
}