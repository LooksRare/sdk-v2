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
| `override?` | [`Addresses`](../interfaces/types.Addresses.md) | Overrides contract addresses for hardhat setup |

## Properties

### addresses

• `Readonly` **addresses**: [`Addresses`](../interfaces/types.Addresses.md)

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

### approveAllCollectionItems

▸ **approveAllCollectionItems**(`collectionAddress`, `approved?`): `Promise`<`ContractTransaction`\>

Approve all the items of a collection, to eventually be traded on LooksRare
The spender is the TransferManager.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `collectionAddress` | `string` | `undefined` | Address of the collection to be approved. |
| `approved` | `boolean` | `true` | true to approve, false to revoke the approval (default to true) |

#### Returns

`Promise`<`ContractTransaction`\>

ContractTransaction

___

### approveErc20

▸ **approveErc20**(`tokenAddress`, `amount?`): `Promise`<`ContractTransaction`\>

Approve an ERC20 to be used as a currency on LooksRare.
The spender is the LooksRareProtocol contract.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddress` | `string` | `undefined` | Address of the ERC20 to approve |
| `amount` | `BigNumber` | `constants.MaxUint256` | Amount to be approved (default to MaxUint256) |

#### Returns

`Promise`<`ContractTransaction`\>

ContractTransaction

___

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
| `nonces` | `BigNumberish`[] | List of nonces to be cancelled |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

___

### cancelSubsetOrders

▸ **cancelSubsetOrders**(`nonces`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Cancel a list of specific subset orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nonces` | `BigNumberish`[] | List of nonces to be cancelled |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

___

### createMakerAsk

▸ **createMakerAsk**(`CreateMakerInput`): `Promise`<[`CreateMakerAskOutput`](../interfaces/types.CreateMakerAskOutput.md)\>

Create a maker ask object ready to be signed

#### Parameters

| Name | Type |
| :------ | :------ |
| `CreateMakerInput` | [`CreateMakerInput`](../interfaces/types.CreateMakerInput.md) |

#### Returns

`Promise`<[`CreateMakerAskOutput`](../interfaces/types.CreateMakerAskOutput.md)\>

the maker object, isTransferManagerApproved, and isTransferManagerApproved

___

### createMakerBid

▸ **createMakerBid**(`CreateMakerInput`): `Promise`<[`CreateMakerBidOutput`](../interfaces/types.CreateMakerBidOutput.md)\>

Create a maker bid object ready to be signed

#### Parameters

| Name | Type |
| :------ | :------ |
| `CreateMakerInput` | [`CreateMakerInput`](../interfaces/types.CreateMakerInput.md) |

#### Returns

`Promise`<[`CreateMakerBidOutput`](../interfaces/types.CreateMakerBidOutput.md)\>

the maker object and isCurrencyApproved

___

### createTaker

▸ **createTaker**(`maker`, `recipient?`, `additionalParameters?`): [`Taker`](../interfaces/types.Taker.md)

Create a taker ask ready to be executed against a maker bid

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `maker` | [`Maker`](../interfaces/types.Maker.md) | `undefined` | Maker order that will be used as counterparty for the taker |
| `recipient` | `string` | `constants.AddressZero` | Recipient address of the taker (if none, it will use the sender) |
| `additionalParameters` | `any`[] | `[]` | Additional parameters used to support complex orders |

#### Returns

[`Taker`](../interfaces/types.Taker.md)

___

### createTakerForCollectionOrder

▸ **createTakerForCollectionOrder**(`maker`, `itemId`, `recipient?`): [`Taker`](../interfaces/types.Taker.md)

Wrapper of createTaker to facilitate taker creation for collection orders

**`See`**

this.createTaker

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maker` | [`Maker`](../interfaces/types.Maker.md) | - |
| `itemId` | `BigNumberish` | Token id to use as a counterparty for the collection order |
| `recipient?` | `string` | Recipient address of the taker (if none, it will use the sender) |

#### Returns

[`Taker`](../interfaces/types.Taker.md)

___

### executeOrder

▸ **executeOrder**(`maker`, `taker`, `signature`, `merkleTree?`, `referrer?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Execute a trade

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `maker` | [`Maker`](../interfaces/types.Maker.md) | `undefined` | - |
| `taker` | [`Taker`](../interfaces/types.Taker.md) | `undefined` | Taker order |
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

▸ **isTransferManagerApproved**(`operator?`): `Promise`<`boolean`\>

Check whether or not an operator has been approved by the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operator` | `string` | Operator address (default to the exchange address) |

#### Returns

`Promise`<`boolean`\>

true if the operator is approved, false otherwise

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

### signMakerOrder

▸ **signMakerOrder**(`maker`): `Promise`<`string`\>

Sign a maker order using the signer provided in the constructor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maker` | [`Maker`](../interfaces/types.Maker.md) | Order to be signed by the user |

#### Returns

`Promise`<`string`\>

Signature

___

### signMultipleMakerOrders

▸ **signMultipleMakerOrders**(`makerOrders`): `Promise`<[`SignMerkleTreeOrdersOutput`](../interfaces/types.SignMerkleTreeOrdersOutput.md)\>

Sign multiple maker orders with a single signature
/!\ Use this function for UI implementation only

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerOrders` | [`Maker`](../interfaces/types.Maker.md)[] | Array of maker orders |

#### Returns

`Promise`<[`SignMerkleTreeOrdersOutput`](../interfaces/types.SignMerkleTreeOrdersOutput.md)\>

Signature and Merkletree

___

### strategyInfo

▸ **strategyInfo**(`strategyId`): `Promise`<[`StrategyInfo`](../interfaces/types.StrategyInfo.md)\>

Retrieve strategy info

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strategyId` | [`StrategyType`](../enums/types.StrategyType.md) | use the enum StrategyType |

#### Returns

`Promise`<[`StrategyInfo`](../interfaces/types.StrategyInfo.md)\>

StrategyType

___

### transferItemsAcrossCollection

▸ **transferItemsAcrossCollection**(`to`, `collectionItems`): `Promise`<[`ContractMethods`](../interfaces/types.ContractMethods.md)\>

Transfer a list of items across different collections

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `to` | `string` | Recipient address |
| `collectionItems` | [`BatchTransferItem`](../interfaces/types.BatchTransferItem.md)[] | Each object in the array represent a list of items for a specific collection |

#### Returns

`Promise`<[`ContractMethods`](../interfaces/types.ContractMethods.md)\>

___

### verifyMakerOrders

▸ **verifyMakerOrders**(`makerOrders`, `signatures`, `merkleTrees?`): `Promise`<[`OrderValidatorCode`](../enums/types.OrderValidatorCode.md)[][]\>

Verify if a set of orders can be executed (i.e are valid)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerOrders` | [`Maker`](../interfaces/types.Maker.md)[] | List of maker orders |
| `signatures` | `string`[] | List of signatures |
| `merkleTrees?` | [`MerkleTree`](../interfaces/types.MerkleTree.md)[] | List of merkle trees (optional) |

#### Returns

`Promise`<[`OrderValidatorCode`](../enums/types.OrderValidatorCode.md)[][]\>

A list of OrderValidatorCode for each order (code 0 being valid)
