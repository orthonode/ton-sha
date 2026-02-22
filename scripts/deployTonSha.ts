import { toNano } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const owner = provider.sender().address!;

    const tonSha = provider.open(await TonSha.fromInit(owner));

    await tonSha.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(tonSha.address);

    console.log('✅ TonSha deployed at:', tonSha.address.toString());
    console.log('Owner:', owner.toString());

    // Verify owner getter works
    const contractOwner = await tonSha.getGetOwner();
    console.log('Contract owner confirmed:', contractOwner.toString());
}
