# Class: LooksRare

[LooksRare](../modules/LooksRare.md).LooksRare

## Constructors

### constructor

• **new LooksRare**(`signer`, `provider`, `chainId`, `override?`)

LooksRare protocol main class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signer` | [`Signer`](../modules/types.md#signer) | Ethers signer |
| `provider` | `Provider` | Ethers provider |
| `chainId` | [`SupportedChainId`](../enums/types.SupportedChainId.md) | Current app chain id |
| `override?` | `Addresses` | Overrides contract addresses for hardhat setup |

## Properties

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

Ethers provider

**`See`**

https://docs.ethers.io/v5/api/providers/

___

### signer

• `Readonly` **signer**: [`Signer`](../modules/types.md#signer)

Ethers signer

**`See`**

https://docs.ethers.io/v5/api/signer/

## Methods

### cancelAllOrders

▸ **cancelAllOrders**(`bid`, `ask`): `Promise`<`ContractReceipt`\>

Cancell all maker bid and/or ask orders for the current user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bid` | `boolean` | Cancel all bids |
| `ask` | `boolean` | Cancel all asks |

#### Returns

`Promise`<`ContractReceipt`\>

___

### cancelOrders

▸ **cancelOrders**(`nonces`): `Promise`<`ContractReceipt`\>

Cancel a list of specific orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nonces` | `BigNumber`[] | List of nonces to be cancelled |

#### Returns

`Promise`<`ContractReceipt`\>

___

### cancelSubsetOrders

▸ **cancelSubsetOrders**(`nonces`): `Promise`<`ContractReceipt`\>

Cancel a list of specific subset orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nonces` | `BigNumber`[] | List of nonces to be cancelled |

#### Returns

`Promise`<`ContractReceipt`\>

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

▸ **executeTakerAsk**(`makerBid`, `takerAsk`, `signature`): `Promise`<`ContractReceipt`\>

Execute a trade with a taker ask and a maker bid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerBid` | [`MakerBid`](../interfaces/types.MakerBid.md) | Maker bid |
| `takerAsk` | [`TakerAsk`](../interfaces/types.TakerAsk.md) | Taker ask |
| `signature` | `string` | Signature of the maker order |

#### Returns

`Promise`<`ContractReceipt`\>

___

### executeTakerBid

▸ **executeTakerBid**(`makerAsk`, `takerBid`, `signature`): `Promise`<`ContractReceipt`\>

Execute a trade with a taker bid and a maker ask

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerAsk` | [`MakerAsk`](../interfaces/types.MakerAsk.md) | Maker ask |
| `takerBid` | [`TakerBid`](../interfaces/types.TakerBid.md) | Taker bid |
| `signature` | `string` | Signature of the maker order |

#### Returns

`Promise`<`ContractReceipt`\>

___

### getTypedDataDomain

▸ **getTypedDataDomain**(): `TypedDataDomain`

Retrieve EIP-712 domain

#### Returns

`TypedDataDomain`

TypedDataDomain

___

### grantTransferManagerApproval

▸ **grantTransferManagerApproval**(`operators?`): `Promise`<`ContractReceipt`\>

Grant a list of operators the rights to transfer user's assets using the transfer manager

**`Default Value`**

Exchange address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operators` | `string`[] | List of operators |

#### Returns

`Promise`<`ContractReceipt`\>

___

### revokeTransferManagerApproval

▸ **revokeTransferManagerApproval**(`operators?`): `Promise`<`ContractReceipt`\>

Revoke a list of operators the rights to transfer user's assets using the transfer manager

**`Default Value`**

Exchange address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operators` | `string`[] | List of operators |

#### Returns

`Promise`<`ContractReceipt`\>

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

▸ **signMultipleMakers**(`makerOrders`): `Promise`<{ `leaves`: `Buffer`[] ; `root`: `string` = merkleRoot.root; `signature`: `string` ; `tree`: `MerkleTree`  }\>

Sign multiple maker orders (bids or asks) with a single signature

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerOrders` | ([`MakerAsk`](../interfaces/types.MakerAsk.md) \| [`MakerBid`](../interfaces/types.MakerBid.md))[] | List of maker order to be signed |

#### Returns

`Promise`<{ `leaves`: `Buffer`[] ; `root`: `string` = merkleRoot.root; `signature`: `string` ; `tree`: `MerkleTree`  }\>

Merkle tree and the signature

___

### transferItemsAcrossCollection

▸ **transferItemsAcrossCollection**(`collections`, `assetTypes`, `from`, `to`, `itemIds`, `amounts`): `Promise`<`ContractReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collections` | `string`[] |
| `assetTypes` | [`AssetType`](../enums/types.AssetType.md)[] |
| `from` | `string` |
| `to` | `string` |
| `itemIds` | `BigNumberish`[][] |
| `amounts` | `BigNumberish`[][] |

#### Returns

`Promise`<`ContractReceipt`\>

___

### transferItemsFromSameCollection

▸ **transferItemsFromSameCollection**(`collection`, `assetType`, `from`, `to`, `itemIds`, `amounts`): `Promise`<`ContractReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `string` |
| `assetType` | [`AssetType`](../enums/types.AssetType.md) |
| `from` | `string` |
| `to` | `string` |
| `itemIds` | `BigNumberish`[] |
| `amounts` | `BigNumberish`[] |

#### Returns

`Promise`<`ContractReceipt`\>
