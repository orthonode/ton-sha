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
    
    // Method 1: hash the cell directly
    const hash1 = await sha256(cell.hash());
    console.log('Method 1 (cell.hash()):', hash1.toString('hex'));
    
    // Method 2: hash the raw bytes
    const hash2 = await sha256(Buffer.from(cell.toBoc()));
    console.log('Method 2 (toBoc):', hash2.toString('hex'));
    
    // Method 3: serialize to buffer manually
    const buf = Buffer.alloc(80); // 8 + 32 + 32 + 8 bytes
    let offset = 0;
    buf.writeBigUInt64BE(HW_ID, offset); offset += 8;
    for (let i = 0; i < 32; i++) buf[offset + i] = Number((FW_HASH >> BigInt((31-i)*8)) & 0xffn);
    offset += 32;
    for (let i = 0; i < 32; i++) buf[offset + i] = Number((EX_HASH >> BigInt((31-i)*8)) & 0xffn);
    offset += 32;
    buf.writeBigUInt64BE(COUNTER, offset);
    const hash3 = await sha256(buf);
    console.log('Method 3 (manual buffer):', hash3.toString('hex'));
}
main();

// Method 4: what Tact's sha256(slice) actually computes
import { TonClient4 } from '@ton/ton';
