import { toNano, Address } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';
import { sha256 } from '@ton/crypto';

const HW_ID = 0x1337133713371337n;
const FW_HASH = 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;
const EX_HASH = 0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafen;
const COUNTER = 1n;

export async function run(provider: NetworkProvider) {
    const contractAddress = Address.parse('kQBqWso0ZgbTc9jhBZ9YRtQF6dDkHdPD0LDWgIzL0S4Ibe6S');
    const tonSha = provider.open(TonSha.fromAddress(contractAddress));

    console.log('Approving firmware...');
    await tonSha.send(provider.sender(), { value: toNano('0.1') }, {
        $$type: 'ApproveFirmware',
        fw_hash: FW_HASH,
    });

    console.log('Waiting 15s...');
    await new Promise(r => setTimeout(r, 15000));

    const isFw = await tonSha.getIsApprovedFirmware(FW_HASH);
    console.log('Firmware approved:', isFw);

    if (!isFw) {
        console.log('ERROR: ApproveFirmware still not working');
        return;
    }

    const buf = Buffer.alloc(80);
    let o = 0;
    buf.writeBigUInt64BE(HW_ID, o); o += 8;
    for (let i = 0; i < 32; i++) buf[o + i] = Number((FW_HASH >> BigInt((31-i)*8)) & 0xffn); o += 32;
    for (let i = 0; i < 32; i++) buf[o + i] = Number((EX_HASH >> BigInt((31-i)*8)) & 0xffn); o += 32;
    buf.writeBigUInt64BE(COUNTER, o);
    const rawDigest = BigInt('0x' + (await sha256(buf)).toString('hex'));
    // Tact sha256() returns signed Int. Send signed value to match.
    const digest = rawDigest >= (1n << 255n) ? rawDigest - (1n << 256n) : rawDigest;

    console.log('Submitting receipt...');
    await tonSha.send(provider.sender(), { value: toNano('0.1') }, {
        $$type: 'VerifyReceipt',
        hw_id: HW_ID, fw_hash: FW_HASH, ex_hash: EX_HASH, counter: COUNTER, digest,
    });

    await new Promise(r => setTimeout(r, 15000));
    const counter = await tonSha.getGetCounter(HW_ID);
    console.log('Counter on-chain:', counter.toString());
    console.log('Done! Check: https://testnet.tonscan.org/address/kQBqWso0ZgbTc9jhBZ9YRtQF6dDkHdPD0LDWgIzL0S4Ibe6S');
}
