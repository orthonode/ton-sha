import { toNano } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const owner = provider.sender().address!;

    const tonSha = provider.open(await TonSha.fromInit(owner));

    console.log('Deploying to:', tonSha.address.toString());

    await tonSha.send(
        provider.sender(),
        {
            value: toNano('0.2'),  // increased from 0.05 — testnet needs more gas
        },
        null,
    );

    // Wait up to 60 seconds, checking every 2 seconds
    await provider.waitForDeploy(tonSha.address, 30, 2000);

    console.log('✅ TonSha deployed at:', tonSha.address.toString());
    console.log('Owner:', owner.toString());

    const contractOwner = await tonSha.getGetOwner();
    console.log('Contract owner confirmed:', contractOwner.toString());
}
