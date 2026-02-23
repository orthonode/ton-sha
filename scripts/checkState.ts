import { Address } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';

const HW_ID = 0x1337133713371337n;
const FW_HASH = 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;

const CONTRACT_KQ = "kQBVqAhPv_ANWm0hfjJdLnQmvvC8_rQ_NEryVX3uFOUF05OP";

export async function run(provider: NetworkProvider) {
    const contractAddress = Address.parse(CONTRACT_KQ);
    const tonSha = provider.open(TonSha.fromAddress(contractAddress));

    const isAuth = await tonSha.getIsAuthorized(HW_ID);
    const isFw = await tonSha.getIsApprovedFirmware(FW_HASH);
    const counter = await tonSha.getGetCounter(HW_ID);

    console.log('Device authorized:', isAuth);
    console.log('Firmware approved:', isFw);
    console.log('Counter on-chain:', counter.toString());
}
