import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import '@ton/test-utils';

describe('TonSha', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tonSha: SandboxContract<TonSha>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tonSha = blockchain.openContract(await TonSha.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await tonSha.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            null,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonSha.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tonSha are ready to use
    });
});
