import { toNano, Address } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';
import { sha256 } from '@ton/crypto';

const HW_ID = 0x1337133713371337n;
const FW_HASH = 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;
const EX_HASH = 0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafen;
const COUNTER = 1n;

const CONTRACT_KQ = "kQBqWso0ZgbTc9jhBZ9YRtQF6dDkHdPD0LDWgIzL0S4Ibe6S";

export async function run(provider: NetworkProvider) {
    const addr = Address.parse(CONTRACT_KQ);
    const tonSha = provider.open(TonSha.fromAddress(addr));

    console.log('Gate 1: Authorizing device...');
    await tonSha.send(provider.sender(), { value: toNano('0.1') }, { $$type: 'AuthorizeDevice', hw_id: HW_ID });
    await new Promise(r => setTimeout(r, 15000));
    console.log('isAuthorized:', await tonSha.getIsAuthorized(HW_ID));

    console.log('Gate 2: Approving firmware...');
    await tonSha.send(provider.sender(), { value: toNano('0.1') }, { $$type: 'ApproveFirmware', fw_hash: FW_HASH });
    await new Promise(r => setTimeout(r, 15000));
    console.log('isApproved:', await tonSha.getIsApprovedFirmware(FW_HASH));

    console.log('Gates 3+4: Submitting receipt...');
    const buf = Buffer.alloc(80);
    let o = 0;
    buf.writeBigUInt64BE(HW_ID, o); o += 8;
    for (let i = 0; i < 32; i++) buf[o + i] = Number((FW_HASH >> BigInt((31-i)*8)) & 0xffn); o += 32;
    for (let i = 0; i < 32; i++) buf[o + i] = Number((EX_HASH >> BigInt((31-i)*8)) & 0xffn); o += 32;
    buf.writeBigUInt64BE(COUNTER, o);
    const rawDigest = BigInt('0x' + (await sha256(buf)).toString('hex'));
    // Tact sha256() returns signed Int. Send signed value to match.
    const digest = rawDigest >= (1n << 255n) ? rawDigest - (1n << 256n) : rawDigest;
    console.log('Digest:', digest.toString(16).slice(0,16) + '...');

    await tonSha.send(provider.sender(), { value: toNano('0.1') }, {
        $$type: 'VerifyReceipt', hw_id: HW_ID, fw_hash: FW_HASH, ex_hash: EX_HASH, counter: COUNTER, digest
    });
    await new Promise(r => setTimeout(r, 15000));

    console.log('Final state:');
    console.log('  authorized:', await tonSha.getIsAuthorized(HW_ID));
    console.log('  fw approved:', await tonSha.getIsApprovedFirmware(FW_HASH));
    console.log('  counter:', (await tonSha.getGetCounter(HW_ID)).toString());
    console.log('Explorer: https://testnet.tonscan.org/address/' + CONTRACT_KQ);
}
