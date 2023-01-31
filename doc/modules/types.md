# Module: types

## Enumerations

- [AssetType](../enums/types.AssetType.md)
- [OrderValidatorCode](../enums/types.OrderValidatorCode.md)
- [StrategyType](../enums/types.StrategyType.md)
- [SupportedChainId](../enums/types.SupportedChainId.md)

## Interfaces

- [ContractMethods](../interfaces/types.ContractMethods.md)
- [MakerAsk](../interfaces/types.MakerAsk.md)
- [MakerAskInputs](../interfaces/types.MakerAskInputs.md)
- [MakerAskOutputs](../interfaces/types.MakerAskOutputs.md)
- [MakerBid](../interfaces/types.MakerBid.md)
- [MakerBidInputs](../interfaces/types.MakerBidInputs.md)
- [MakerBidOutputs](../interfaces/types.MakerBidOutputs.md)
- [MerkleTree](../interfaces/types.MerkleTree.md)
- [MultipleOrdersWithMerkleTree](../interfaces/types.MultipleOrdersWithMerkleTree.md)
- [TakerAsk](../interfaces/types.TakerAsk.md)
- [TakerBid](../interfaces/types.TakerBid.md)

## Type Aliases

### Signer

Ƭ **Signer**: `ethers.Signer` & `TypedDataSigner`

Temporary type until full of TypedDataSigner in ethers V6

**`See`**

https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L53

___

### SolidityType

Ƭ **SolidityType**: ``"bool"`` \| ``"address"`` \| ``"uint8"`` \| ``"uint16"`` \| ``"uint112"`` \| ``"uint256"`` \| ``"uint256[]"`` \| ``"bytes"`` \| ``"bytes32"`` \| ``"bytes32[]"`` \| ``"string"``

Solidity types (used for EIP-712 types)
