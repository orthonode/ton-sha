# Tact compilation report
Contract: TonSha
BoC Size: 1293 bytes

## Structures (Structs and Messages)
Total structures: 20

### DataSize
TL-B: `_ cells:int257 bits:int257 refs:int257 = DataSize`
Signature: `DataSize{cells:int257,bits:int257,refs:int257}`

### SignedBundle
TL-B: `_ signature:fixed_bytes64 signedData:remainder<slice> = SignedBundle`
Signature: `SignedBundle{signature:fixed_bytes64,signedData:remainder<slice>}`

### StateInit
TL-B: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

### Context
TL-B: `_ bounceable:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounceable:bool,sender:address,value:int257,raw:^slice}`

### SendParameters
TL-B: `_ mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell value:int257 to:address bounce:bool = SendParameters`
Signature: `SendParameters{mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell,value:int257,to:address,bounce:bool}`

### MessageParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 to:address bounce:bool = MessageParameters`
Signature: `MessageParameters{mode:int257,body:Maybe ^cell,value:int257,to:address,bounce:bool}`

### DeployParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 bounce:bool init:StateInit{code:^cell,data:^cell} = DeployParameters`
Signature: `DeployParameters{mode:int257,body:Maybe ^cell,value:int257,bounce:bool,init:StateInit{code:^cell,data:^cell}}`

### StdAddress
TL-B: `_ workchain:int8 address:uint256 = StdAddress`
Signature: `StdAddress{workchain:int8,address:uint256}`

### VarAddress
TL-B: `_ workchain:int32 address:^slice = VarAddress`
Signature: `VarAddress{workchain:int32,address:^slice}`

### BasechainAddress
TL-B: `_ hash:Maybe int257 = BasechainAddress`
Signature: `BasechainAddress{hash:Maybe int257}`

### Deploy
TL-B: `deploy#946a98b6 queryId:uint64 = Deploy`
Signature: `Deploy{queryId:uint64}`

### DeployOk
TL-B: `deploy_ok#aff90f57 queryId:uint64 = DeployOk`
Signature: `DeployOk{queryId:uint64}`

### FactoryDeploy
TL-B: `factory_deploy#6d0ff13b queryId:uint64 cashback:address = FactoryDeploy`
Signature: `FactoryDeploy{queryId:uint64,cashback:address}`

### VerifyReceipt
TL-B: `verify_receipt#d00fed3b hw_id:uint64 fw_hash:uint256 ex_hash:uint256 counter:uint64 digest:uint256 = VerifyReceipt`
Signature: `VerifyReceipt{hw_id:uint64,fw_hash:uint256,ex_hash:uint256,counter:uint64,digest:uint256}`

### AuthorizeDevice
TL-B: `authorize_device#27d3e2ba hw_id:uint64 = AuthorizeDevice`
Signature: `AuthorizeDevice{hw_id:uint64}`

### ApproveFirmware
TL-B: `approve_firmware#f1496a39 fw_hash:uint256 = ApproveFirmware`
Signature: `ApproveFirmware{fw_hash:uint256}`

### RevokeDevice
TL-B: `revoke_device#2f2aa60c hw_id:uint64 = RevokeDevice`
Signature: `RevokeDevice{hw_id:uint64}`

### VerificationPassed
TL-B: `verification_passed#eb9f1ed5 hw_id:uint64 counter:uint64 = VerificationPassed`
Signature: `VerificationPassed{hw_id:uint64,counter:uint64}`

### VerificationFailed
TL-B: `verification_failed#92a79d64 hw_id:uint64 reason:uint8 = VerificationFailed`
Signature: `VerificationFailed{hw_id:uint64,reason:uint8}`

### TonSha$Data
TL-B: `_ owner:address authorized_devices:dict<int, bool> approved_firmware:dict<int, bool> counters:dict<int, int> = TonSha`
Signature: `TonSha{owner:address,authorized_devices:dict<int, bool>,approved_firmware:dict<int, bool>,counters:dict<int, int>}`

## Get methods
Total get methods: 4

## isAuthorized
Argument: hw_id

## isApprovedFirmware
Argument: fw_hash

## getCounter
Argument: hw_id

## getOwner
No arguments

## Exit codes
* 2: Stack underflow
* 3: Stack overflow
* 4: Integer overflow
* 5: Integer out of expected range
* 6: Invalid opcode
* 7: Type check error
* 8: Cell overflow
* 9: Cell underflow
* 10: Dictionary error
* 11: 'Unknown' error
* 12: Fatal error
* 13: Out of gas error
* 14: Virtualization error
* 32: Action list is invalid
* 33: Action list is too long
* 34: Action is invalid or not supported
* 35: Invalid source address in outbound message
* 36: Invalid destination address in outbound message
* 37: Not enough Toncoin
* 38: Not enough extra currencies
* 39: Outbound message does not fit into a cell after rewriting
* 40: Cannot process a message
* 41: Library reference is null
* 42: Library change action error
* 43: Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree
* 50: Account state size exceeded limits
* 128: Null reference exception
* 129: Invalid serialization prefix
* 130: Invalid incoming message
* 131: Constraints error
* 132: Access denied
* 133: Contract stopped
* 134: Invalid argument
* 135: Code of a contract was not found
* 136: Invalid standard address
* 138: Not a basechain address
* 14534: Not owner

## Trait inheritance diagram

```mermaid
graph TD
TonSha
TonSha --> BaseTrait
```

## Contract dependency diagram

```mermaid
graph TD
TonSha
```