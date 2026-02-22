import { toNano, beginCell, Address } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';
import { sha256 } from '@ton/crypto';

const HW_ID = 0x1337133713371337n;
const FW_HASH = 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;
const EX_HASH = 0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafen;
const COUNTER = 1n;

export async function run(provider: NetworkProvider) {
    const contractAddress = Address.parse('kQA2fMBzpJ8yOUtSTj8HAB2q1U37uDRoHNBRFqPbGFaBLvDO');
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

    const cell = beginCell()
        .storeUint(HW_ID, 64)
        .storeUint(FW_HASH, 256)
        .storeUint(EX_HASH, 256)
        .storeUint(COUNTER, 64)
        .endCell();
    const hash = await sha256(cell.bits.subbuffer(0, cell.bits.length)!);
    const digest = BigInt('0x' + hash.toString('hex'));

    console.log('Submitting receipt...');
    await tonSha.send(provider.sender(), { value: toNano('0.1') }, {
        $$type: 'VerifyReceipt',
        hw_id: HW_ID, fw_hash: FW_HASH, ex_hash: EX_HASH, counter: COUNTER, digest,
    });

    await new Promise(r => setTimeout(r, 15000));
    const counter = await tonSha.getGetCounter(HW_ID);
    console.log('Counter on-chain:', counter.toString());
    console.log('Done! Check: https://testnet.tonscan.org/address/kQA2fMBzpJ8yOUtSTj8HAB2q1U37uDRoHNBRFqPbGFaBLvDO');
}
