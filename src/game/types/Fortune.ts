export interface Fortune {
    type: string;
    sub: Sub;
}

export interface Sub {
    id: number;
    name: string;
    desc: string;
}