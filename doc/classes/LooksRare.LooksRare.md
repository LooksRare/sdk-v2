# Class: LooksRare

[LooksRare](../modules/LooksRare.md).LooksRare

## Constructors

### constructor

• **new LooksRare**(`chainId`, `provider`, `signer?`, `override?`)

LooksRare protocol main class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | [`SupportedChainId`](../enums/types.SupportedChainId.md) | Current app chain id |
| `provider` | `Provider` | Ethers provider |
| `signer?` | [`Signer`](../modules/types.md#signer) | Ethers signer |
| `override?` | `Addresses` | Overrides contract addresses for hardhat setup |

## Properties

### ERROR\_SIGNER

• `Readonly` **ERROR\_SIGNER**: `Error`

Custom error undefined signer

___

### ERROR\_TIMESTAMP

• `Readonly` **ERROR\_TIMESTAMP**: `Error`

Custom error invalid timestamp

___

### addresses

• `Readonly` **addresses**: `Addresses`

Mapping of LooksRare protocol addresses for the current chain

___

### chainId

• `Readonly` **chainId**: [`SupportedChainId`](../enums/types.SupportedChainId.md)

Current app chain ID

___

### provider

• `Readonly` **provider**: `Provider`

Ethers multicall provider

**`See`**

 - https://docs.ethers.io/v5/api/providers/
 - https://github.com/0xsequence/sequence.js/tree/master/packages/multicall

___

### signer

• `Optional` `Readonly` **signer**: [`Signer`](../modules/types.md#signer)

Ethers signer

**`See`**

https://docs.ethers.io/v5/api/signer/

## Methods

### cancelAllOrders

▸ **cancelAllOrders**(`bid`, `ask`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Cancell all maker bid and/or ask orders for the current user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bid` | `boolean` | Cancel all bids |
| `ask` | `boolean` | Cancel all asks |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

___

### cancelOrders

▸ **cancelOrders**(`nonces`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Cancel a list of specific orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nonces` | `BigNumber`[] | List of nonces to be cancelled |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

___

### cancelSubsetOrders

▸ **cancelSubsetOrders**(`nonces`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Cancel a list of specific subset orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nonces` | `BigNumber`[] | List of nonces to be cancelled |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

___

### createMakerAsk

▸ **createMakerAsk**(`makerAskInputs`): `Promise`<[`MakerAskOutputs`](../interfaces/types.MakerAskOutputs.md)\>

Create a maker ask object ready to be signed

#### Parameters

| Name | Type |
| :------ | :------ |
| `makerAskInputs` | [`MakerAskInputs`](../interfaces/types.MakerAskInputs.md) |

#### Returns

`Promise`<[`MakerAskOutputs`](../interfaces/types.MakerAskOutputs.md)\>

MakerAskOutputs

___

### createMakerBid

▸ **createMakerBid**(`makerBidOutputs`): `Promise`<[`MakerBidOutputs`](../interfaces/types.MakerBidOutputs.md)\>

Create a maker bid object ready to be signed

#### Parameters

| Name | Type |
| :------ | :------ |
| `makerBidOutputs` | [`MakerBidInputs`](../interfaces/types.MakerBidInputs.md) |

#### Returns

`Promise`<[`MakerBidOutputs`](../interfaces/types.MakerBidOutputs.md)\>

MakerBidOutputs

___

### createMakerMerkleTree

▸ **createMakerMerkleTree**(`makerOrders`): [`MerkleTree`](../interfaces/types.MerkleTree.md)

Create multiple listing using a merkle tree

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerOrders` | ([`MakerAsk`](../interfaces/types.MakerAsk.md) \| [`MakerBid`](../interfaces/types.MakerBid.md))[] | List of maker orders (bid or ask) |

#### Returns

[`MerkleTree`](../interfaces/types.MerkleTree.md)

MerkleTree

___

### createTakerAsk

▸ **createTakerAsk**(`makerBid`, `recipient`, `additionalParameters?`): [`TakerAsk`](../interfaces/types.TakerAsk.md)

Create a taker ask ready to be executed against a maker bid

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `makerBid` | [`MakerBid`](../interfaces/types.MakerBid.md) | `undefined` | Maker bid that will be used as counterparty for the taker ask |
| `recipient` | `string` | `undefined` | Recipient address of the taker |
| `additionalParameters` | `any`[] | `[]` | Additional parameters used to support complex orders |

#### Returns

[`TakerAsk`](../interfaces/types.TakerAsk.md)

___

### createTakerBid

▸ **createTakerBid**(`makerAsk`, `recipient`, `additionalParameters?`): [`TakerBid`](../interfaces/types.TakerBid.md)

Create a taker bid ready to be executed against a maker ask

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `makerAsk` | [`MakerAsk`](../interfaces/types.MakerAsk.md) | `undefined` | Maker ask that will be used as counterparty for the taker bid |
| `recipient` | `string` | `undefined` | Recipient address of the taker |
| `additionalParameters` | `any`[] | `[]` | Additional parameters used to support complex orders |

#### Returns

[`TakerBid`](../interfaces/types.TakerBid.md)

___

### executeTakerAsk

▸ **executeTakerAsk**(`makerBid`, `takerAsk`, `signature`, `merkleTree?`, `referrer?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Execute a trade with a taker ask and a maker bid

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `makerBid` | [`MakerBid`](../interfaces/types.MakerBid.md) | `undefined` | Maker bid |
| `takerAsk` | [`TakerAsk`](../interfaces/types.TakerAsk.md) | `undefined` | Taker ask |
| `signature` | `string` | `undefined` | Signature of the maker order |
| `merkleTree` | [`MerkleTree`](../interfaces/types.MerkleTree.md) | `undefined` | If the maker has been signed with a merkle tree |
| `referrer` | `string` | `constants.AddressZero` | Referrer address if applicable |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

___

### executeTakerBid

▸ **executeTakerBid**(`makerAsk`, `takerBid`, `signature`, `merkleTree?`, `referrer?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Execute a trade with a taker bid and a maker ask

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `makerAsk` | [`MakerAsk`](../interfaces/types.MakerAsk.md) | `undefined` | Maker ask |
| `takerBid` | [`TakerBid`](../interfaces/types.TakerBid.md) | `undefined` | Taker bid |
| `signature` | `string` | `undefined` | Signature of the maker order |
| `merkleTree` | [`MerkleTree`](../interfaces/types.MerkleTree.md) | `undefined` | If the maker has been signed with a merkle tree |
| `referrer` | `string` | `constants.AddressZero` | Referrer address if applicable |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

___

### getSigner

▸ `Private` **getSigner**(): [`Signer`](../modules/types.md#signer)

Return the signer it it's set, throw an exception otherwise

#### Returns

[`Signer`](../modules/types.md#signer)

Signer

___

### getTypedDataDomain

▸ **getTypedDataDomain**(): `TypedDataDomain`

Retrieve EIP-712 domain

#### Returns

`TypedDataDomain`

TypedDataDomain

___

### grantTransferManagerApproval

▸ **grantTransferManagerApproval**(`operators?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Grant a list of operators the rights to transfer user's assets using the transfer manager

**`Default Value`**

Exchange address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operators` | `string`[] | List of operators (default to the exchange address) |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

___

### isTransferManagerApproved

▸ **isTransferManagerApproved**(`operators?`): `Promise`<`boolean`\>

Check whether or not an operator has been approved by the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operators` | `string` | List of operators (default to the exchange address) |

#### Returns

`Promise`<`boolean`\>

___

### revokeTransferManagerApproval

▸ **revokeTransferManagerApproval**(`operators?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Revoke a list of operators the rights to transfer user's assets using the transfer manager

**`Default Value`**

Exchange address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operators` | `string`[] | List of operators |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

___

### signMakerAsk

▸ **signMakerAsk**(`makerAsk`): `Promise`<`string`\>

Sign a maker ask using the signer provided in the constructor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerAsk` | [`MakerAsk`](../interfaces/types.MakerAsk.md) | Order to be signed by the user |

#### Returns

`Promise`<`string`\>

Signature

___

### signMakerBid

▸ **signMakerBid**(`makerBid`): `Promise`<`string`\>

Sign a maker bid using the signer provided in the constructor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerBid` | [`MakerBid`](../interfaces/types.MakerBid.md) | Order to be signed by the user |

#### Returns

`Promise`<`string`\>

Signature

___

### signMultipleMakers

▸ **signMultipleMakers**(`hexRoot`): `Promise`<`string`\>

Sign multiple maker orders (bids or asks) with a single signature

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hexRoot` | `string` | Merkler tree root |

#### Returns

`Promise`<`string`\>

Signature

___

### transferItemsAcrossCollection

▸ **transferItemsAcrossCollection**(`collections`, `assetTypes`, `to`, `itemIds`, `amounts`): `Promise`<[`ContractMethods`](../interfaces/types.ContractMethods.md)\>

Transfer a list of items across different collections

#### Parameters

| Name | Type |
| :------ | :------ |
| `collections` | `string`[] |
| `assetTypes` | [`AssetType`](../enums/types.AssetType.md)[] |
| `to` | `string` |
| `itemIds` | `BigNumberish`[][] |
| `amounts` | `BigNumberish`[][] |

#### Returns

`Promise`<[`ContractMethods`](../interfaces/types.ContractMethods.md)\>

___

### verifyMakerAskOrders

▸ **verifyMakerAskOrders**(`makerAskOrders`, `signatures`, `merkleTrees`): `Promise`<[`OrderValidatorCode`](../enums/types.OrderValidatorCode.md)[][]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerAskOrders` | [`MakerAsk`](../interfaces/types.MakerAsk.md)[] | List of maker ask orders |
| `signatures` | `string`[] | List of signatures |
| `merkleTrees` | [`MerkleTree`](../interfaces/types.MerkleTree.md)[] | List of merkle tree (if applicable) |

#### Returns

`Promise`<[`OrderValidatorCode`](../enums/types.OrderValidatorCode.md)[][]\>

A list of OrderValidatorCode for each order (code 0 being valid)

___

### verifyMakerBidOrders

▸ **verifyMakerBidOrders**(`makerBidOrders`, `signatures`, `merkleTrees`): `Promise`<[`OrderValidatorCode`](../enums/types.OrderValidatorCode.md)[][]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerBidOrders` | [`MakerBid`](../interfaces/types.MakerBid.md)[] | List of maker bid orders |
| `signatures` | `string`[] | List of signatures |
| `merkleTrees` | [`MerkleTree`](../interfaces/types.MerkleTree.md)[] | List of merkle tree (if applicable) |

#### Returns

`Promise`<[`OrderValidatorCode`](../enums/types.OrderValidatorCode.md)[][]\>

A list of OrderValidatorCode for each order (code 0 being valid)
