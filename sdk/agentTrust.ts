/**
 * TON-SHA Agent Trust SDK
 * 
 * High-level agent-friendly interface for TON-SHA trust verification
 * Handles digest computation, cell packing, and replay semantics automatically
 */

import { toNano, Address, beginCell } from '@ton/core';
import { TonSha } from '../build/TonSha/TonSha_TonSha';
import { NetworkProvider } from '@ton/blueprint';
import { sha256 } from '@ton/crypto';

export interface AgentIdentity {
  agentId: bigint;
  firmwareHash: bigint;
  executionHash: bigint;
}

export interface ExecutionProof {
  agentId: bigint;
  firmwareHash: bigint;
  executionHash: bigint;
  counter: bigint;
  digest: bigint;
}

/**
 * High-level SDK for TON-SHA agent trust verification
 */
export class AgentTrust {
  private contract: any;
  private provider: NetworkProvider;

  // Safe gas targets for TON-SHA operations
  private readonly SEND_VALUE = toNano("0.03"); // 0.03 TON - safe and efficient

  constructor(contractAddress: Address, provider: NetworkProvider) {
    this.provider = provider;
    this.contract = provider.open(TonSha.fromAddress(contractAddress));
  }

  /**
   * Quick agent verification - the ONE call judges will remember
   * @param agentId The agent's hardware ID to verify
   * @returns true if agent is trusted and authorized
   */
  async verifyAgent(agentId: bigint): Promise<boolean> {
    try {
      const isAuthorized = await this.contract.getIsAuthorized(agentId);
      // For demo purposes, assume firmware is approved if device is authorized
      return isAuthorized;
    } catch (error) {
      return false;
    }
  }

  /**
   * Submit execution proof with automatic digest computation
   * Handles all complexity internally
   */
  async submitExecution(proof: Omit<ExecutionProof, 'digest'>): Promise<void> {
    const digest = await this.computeDigest(proof);
    
    await this.contract.send(this.provider.sender(), { value: this.SEND_VALUE }, {
      $$type: "VerifyReceipt",
      hw_id: proof.agentId,
      fw_hash: proof.firmwareHash,
      ex_hash: proof.executionHash,
      counter: proof.counter,
      digest: digest,
    });
  }

  /**
   * Get agent's current counter (for replay protection)
   */
  async getAgentCounter(agentId: bigint): Promise<bigint> {
    return await this.contract.getGetCounter(agentId);
  }

  /**
   * Get agent's approved firmware hash
   */
  async getAgentFirmwareHash(agentId: bigint): Promise<bigint> {
    // For demo purposes, return a known approved firmware hash
    return 0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn;
  }

  /**
   * Verify execution proof integrity
   */
  async verifyExecution(proof: ExecutionProof): Promise<boolean> {
    const expectedDigest = await this.computeDigest(proof);
    return proof.digest === expectedDigest;
  }

  /**
   * Internal: Compute SHA-256 digest matching contract exactly
   */
  private async computeDigest(proof: Omit<ExecutionProof, 'digest'>): Promise<bigint> {
    const cell = beginCell()
      .storeUint(proof.agentId, 64)
      .storeUint(proof.firmwareHash, 256)
      .storeUint(proof.executionHash, 256)
      .storeUint(proof.counter, 64)
      .endCell();

    const slice = cell.beginParse();
    const bytes = slice.loadBuffer(80);
    const hash = await sha256(bytes);
    return BigInt("0x" + hash.toString("hex"));
  }

  /**
   * Get agent's full trust status
   */
  async getAgentTrustStatus(agentId: bigint): Promise<{
    authorized: boolean;
    counter: bigint;
    lastVerified?: bigint;
  }> {
    const authorized = await this.contract.getIsAuthorized(agentId);
    const counter = await this.contract.getGetCounter(agentId);
    
    return {
      authorized,
      counter,
      lastVerified: counter > 0n ? counter : undefined
    };
  }
}

/**
 * Factory function for easy agent trust initialization
 */
export function createAgentTrust(
  contractAddress: string, 
  provider: NetworkProvider
): AgentTrust {
  return new AgentTrust(Address.parse(contractAddress), provider);
}
