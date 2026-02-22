import { toNano, beginCell, Address } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';
import { sha256 } from '@ton/crypto';

const HW_ID = 0x1337133713371337n;
const FW_HASH = 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;
const EX_HASH = 0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafen;
const COUNTER = 1n;

export async function run(provider: NetworkProvider) {
    const addr = Address.parse('kQA2fMBzpJ8yOUtSTj8HAB2q1U37uDRoHNBRFqPbGFaBLvDO');
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
    const cell = beginCell()
        .storeUint(HW_ID, 64).storeUint(FW_HASH, 256).storeUint(EX_HASH, 256).storeUint(COUNTER, 64)
        .endCell();
    const buf = cell.bits.subbuffer(0, cell.bits.length)!;
    const digest = BigInt('0x' + (await sha256(buf)).toString('hex'));
    console.log('Digest:', digest.toString(16).slice(0,16) + '...');

    await tonSha.send(provider.sender(), { value: toNano('0.1') }, {
        $$type: 'VerifyReceipt', hw_id: HW_ID, fw_hash: FW_HASH, ex_hash: EX_HASH, counter: COUNTER, digest
    });
    await new Promise(r => setTimeout(r, 15000));

    console.log('Final state:');
    console.log('  authorized:', await tonSha.getIsAuthorized(HW_ID));
    console.log('  fw approved:', await tonSha.getIsApprovedFirmware(FW_HASH));
    console.log('  counter:', (await tonSha.getGetCounter(HW_ID)).toString());
    console.log('Explorer: https://testnet.tonscan.org/address/kQA2fMBzpJ8yOUtSTj8HAB2q1U37uDRoHNBRFqPbGFaBLvDO');
}
