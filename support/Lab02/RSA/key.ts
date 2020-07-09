export class PublicKey    {
    private readonly n: number;
    private readonly e: number;
    private readonly eArray: number[];
    constructor(n:number, e: number[]) {
        this.n = n;
        this.eArray = e;
        this.e = e[0];
    }

    getE(): number {
        return this.e
    }
    getEArray(): number[] {
        return this.eArray;
    }

    getN(): number {
        return this.n;
    }
}

export class PrivateKey    {
    private readonly n: number;
    private readonly d: number;
    private readonly dArray: number[];

    constructor(n:number, d: number[]) {
        this.n = n;
        this.d = d[0];
        this.dArray = d;
    }

    getD(): number {
        return this.d;
    }
    getDArray(): number[] {
        return this.dArray;
    }

    getN(): number {
        return this.n;
    }
}