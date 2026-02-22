import { beginCell } from '@ton/core';
import { sha256 } from '@ton/crypto';

const HW_ID = 0x1337133713371337n;
const FW_HASH = 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;
const EX_HASH = 0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafen;
const COUNTER = 1n;

async function main() {
    const cell = beginCell()
        .storeUint(HW_ID, 64)
        .storeUint(FW_HASH, 256)
        .storeUint(EX_HASH, 256)
        .storeUint(COUNTER, 64)
        .endCell();

    // Tact's sha256(slice) hashes the bits of the slice as bytes
    const slice = cell.beginParse();
    const bits = slice.remainingBits;
    const bytes = Math.ceil(bits / 8);
    const buf = Buffer.alloc(bytes);
    const data = cell.bits.subbuffer(0, bits);
    if (data) {
        data.copy(buf);
    }
    const hash = await sha256(buf);
    console.log('Tact sha256(slice) result:', hash.toString('hex'));
    console.log('As BigInt:', '0x' + hash.toString('hex'));
}
main();
