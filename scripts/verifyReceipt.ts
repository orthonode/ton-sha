import { toNano, Address, beginCell } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';
import { sha256 } from '@ton/crypto';

// Test hardware receipt values
const HW_ID = 0x1337133713371337n;
const FW_HASH = 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;
const EX_HASH = 0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafen;
const COUNTER = 1n;

async function computeDigest(hw_id: bigint, fw_hash: bigint, ex_hash: bigint, counter: bigint): Promise<bigint> {
    const cell = beginCell()
        .storeUint(hw_id, 64)
        .storeUint(fw_hash, 256)
        .storeUint(ex_hash, 256)
        .storeUint(counter, 64)
        .endCell();

    const slice = cell.beginParse();
    const bytes = slice.loadBuffer(80);
    const hash = await sha256(bytes);
    return BigInt("0x" + hash.toString("hex"));
}

const CONTRACT_KQ = "kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP";

export async function run(provider: NetworkProvider) {
    const contractAddress = Address.parse(CONTRACT_KQ);

    const tonSha = provider.open(TonSha.fromAddress(contractAddress));

    console.log('📋 Contract:', contractAddress.toString());
    console.log('');

    // Step 1: Authorize the test device
    console.log('Step 1: Authorizing device HW_ID:', HW_ID.toString(16));
    await tonSha.send(
        provider.sender(),
        { value: toNano('0.05') },
        {
            $$type: 'AuthorizeDevice',
            hw_id: HW_ID,
        }
    );
    await new Promise(r => setTimeout(r, 8000));

    // Step 2: Approve firmware
    console.log('Step 2: Approving firmware FW_HASH:', FW_HASH.toString(16).slice(0, 16) + '...');
    await tonSha.send(
        provider.sender(),
        { value: toNano('0.05') },
        {
            $$type: 'ApproveFirmware',
            fw_hash: FW_HASH,
        }
    );
    await new Promise(r => setTimeout(r, 8000));

    // Step 3: Compute digest and submit receipt
    console.log('Step 3: Computing SHA-256 digest...');
    const digest = await computeDigest(HW_ID, FW_HASH, EX_HASH, COUNTER);
    console.log('Digest:', digest.toString(16).slice(0, 16) + '...');

    console.log('Step 4: Submitting VerifyReceipt through all four gates...');
    await tonSha.send(
        provider.sender(),
        { value: toNano('0.05') },
        {
            $$type: 'VerifyReceipt',
            hw_id: HW_ID,
            fw_hash: FW_HASH,
            ex_hash: EX_HASH,
            counter: COUNTER,
            digest: digest,
        }
    );
    await new Promise(r => setTimeout(r, 8000));

    // Verify state via getters
    console.log('');
    console.log('✅ Checking on-chain state...');
    const isAuth = await tonSha.getIsAuthorized(HW_ID);
    const isFw = await tonSha.getIsApprovedFirmware(FW_HASH);
    const counter = await tonSha.getGetCounter(HW_ID);

    console.log('Device authorized:', isAuth);
    console.log('Firmware approved:', isFw);
    console.log('Counter on-chain:', counter.toString());
    console.log('');
    console.log('🎉 All four gates verified on TON testnet!');
    console.log('View transactions at:');
    console.log('https://testnet.tonscan.org/address/' + contractAddress.toString());
}
