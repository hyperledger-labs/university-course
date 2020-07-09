import {PrivateKey, PublicKey} from "./key";

export class RSAService {
    //Kr
    private Kr: PrivateKey;

    //Ku
    private Ku: PublicKey;

    // For a more reliable implementation, p and q should not be stored
    // private readonly p: string;
    // private readonly q: string;
    private n: number;
    private z: number;

    // Part of the private key (Kr, d)
    private d: number[];

    // Part of the public key (Ku, e)
    private e: number[];

    constructor(p: number, q: number)  {
        let gcd = this.gcd(p,q);
        console.log(gcd)
        if (gcd !== 1) {
            throw  new Error (`p and q need to be primes. Their gcd is: , ${gcd}`);
        }
        this.n = p * q;
        this.z = (p - 1) * (q - 1);
        this.e = [];
        this.d = [];

        this.defineE(this.z);
        this.createPublicKey();
        this.defineD(this.z,this.e[0]);
        this.createPrivateKey();
    }

    private defineE (z:number)  {
        for (let e = 2; e < z ; e++) {
            if (this.gcd(e,z) == 1) {
                this.e.push(e);
            }
        }
        return;
    }
    private createPublicKey ()  {
        this.Ku = new PublicKey(this.n, this.e);
        return;
    }

    private defineD (z:number, e:number)    {
        for (let d = 0; d < z; d++)  {
            if ((e * d) % z === 1)   {
                this.d.push(d);
            }
        }
    }

    private createPrivateKey ()    {
        this.Kr = new PrivateKey(this.n, this.d);
        return;
    }

    getPublicKey () {
        return this.Ku;
    }

    getPrivateKey() {
        return this.Kr;
    }

    // M = M(Kr) mod N
    public encryptMessage (message: number, Ku: PublicKey): number {
        //Check number < N
        if (message >= this.n)  {
            throw Error('Message cannot be higher than N = p.q');
        }
        const e = Ku.getE();
        return (message ** e) % this.n;
    }

    // C = C(Kr) mod N
    public decryptMessage (message: number, Kr: PrivateKey): number  {
        const d = Kr.getD();
        return (message ** d) % this.n;
    }

    // Calculates the greatest common divisor recursively
    private gcd (a: number, b:number) : number {
        if (!b) {
            return a;
        }

        return this.gcd(b, a % b);
    }

}