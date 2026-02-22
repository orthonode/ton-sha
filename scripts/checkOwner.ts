import { Address } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractAddress = Address.parse('EQA2fMBzpJ8yOUtSTj8HAB2q1U37uDRoHNBRFqPbGFaBLktE');
    const tonSha = provider.open(TonSha.fromAddress(contractAddress));
    const owner = await tonSha.getGetOwner();
    console.log('Contract owner:', owner.toString());
    console.log('Your wallet:   ', provider.sender().address?.toString());
}
