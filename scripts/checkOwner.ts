import { Address } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const contractAddress = Address.parse('EQBqWso0ZgbTc9jhBZ9YRtQF6dDkHdPD0LDWgIzL0S4IbVUY');
    const tonSha = provider.open(TonSha.fromAddress(contractAddress));
    const owner = await tonSha.getGetOwner();
    console.log('Contract owner:', owner.toString());
    console.log('Your wallet:   ', provider.sender().address?.toString());
}
