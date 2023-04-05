# Module: types

## Enumerations

- [CollectionType](../enums/types.CollectionType.md)
- [MerkleTreeNodePosition](../enums/types.MerkleTreeNodePosition.md)
- [OrderValidatorCode](../enums/types.OrderValidatorCode.md)
- [QuoteType](../enums/types.QuoteType.md)
- [StrategyType](../enums/types.StrategyType.md)
- [SupportedChainId](../enums/types.SupportedChainId.md)

## Interfaces

- [Addresses](../interfaces/types.Addresses.md)
- [BatchTransferItem](../interfaces/types.BatchTransferItem.md)
- [ContractMethods](../interfaces/types.ContractMethods.md)
- [CreateMakerAskOutput](../interfaces/types.CreateMakerAskOutput.md)
- [CreateMakerBidOutput](../interfaces/types.CreateMakerBidOutput.md)
- [CreateMakerInput](../interfaces/types.CreateMakerInput.md)
- [Maker](../interfaces/types.Maker.md)
- [MerkleTree](../interfaces/types.MerkleTree.md)
- [MerkleTreeProof](../interfaces/types.MerkleTreeProof.md)
- [SignMerkleTreeOrdersOutput](../interfaces/types.SignMerkleTreeOrdersOutput.md)
- [StrategyInfo](../interfaces/types.StrategyInfo.md)
- [Taker](../interfaces/types.Taker.md)

## Type Aliases

### CreateMakerCollectionOfferInput

Ƭ **CreateMakerCollectionOfferInput**: `Omit`<[`CreateMakerInput`](../interfaces/types.CreateMakerInput.md), ``"strategyId"`` \| ``"itemIds"``\>

___

### CreateMakerCollectionOfferWithProofInput

Ƭ **CreateMakerCollectionOfferWithProofInput**: `Omit`<[`CreateMakerInput`](../interfaces/types.CreateMakerInput.md), ``"strategyId"``\>

___

### EIP712TypedData

Ƭ **EIP712TypedData**: `Record`<`string`, `TypedDataField`[]\>

EIP712 type data

___

### Signer

Ƭ **Signer**: `ethers.Signer` & `TypedDataSigner`

Temporary type until full of TypedDataSigner in ethers V6

**`See`**

https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L53

___

### SolidityType

Ƭ **SolidityType**: ``"bool"`` \| ``"address"`` \| ``"uint8"`` \| ``"uint16"`` \| ``"uint112"`` \| ``"uint256"`` \| ``"uint256[]"`` \| ``"bytes"`` \| ``"bytes32"`` \| ``"bytes32[]"`` \| ``"string"``

Solidity types (used for EIP-712 types)
