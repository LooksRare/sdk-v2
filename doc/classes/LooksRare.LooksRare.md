# Class: LooksRare

[LooksRare](../modules/LooksRare.md).LooksRare

LooksRare
This class provides helpers to interact with the LooksRare V2 contracts

## Constructors

### constructor

• **new LooksRare**(`chainId`, `provider`, `signer?`, `override?`)

LooksRare protocol main class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | [`ChainId`](../enums/types.ChainId.md) | Current app chain id |
| `provider` | `Provider` | Ethers provider |
| `signer?` | `Signer` | Ethers signer |
| `override?` | [`Addresses`](../interfaces/types.Addresses.md) | Overrides contract addresses for hardhat setup |

## Properties

### addresses

• `Readonly` **addresses**: [`Addresses`](../interfaces/types.Addresses.md)

Mapping of LooksRare protocol addresses for the current chain

___

### chainId

• `Readonly` **chainId**: [`ChainId`](../enums/types.ChainId.md)

Current app chain ID

___

### provider

• `Readonly` **provider**: `Provider`

Ethers provider. If you want a batch functionality, use JsonRpcProvider.

**`See`**

[Ethers provider doc](https://docs.ethers.org/v6/api/providers/#Provider)

___

### signer

• `Optional` `Readonly` **signer**: `Signer`

Ethers signer

**`See`**

[Ethers signer doc](https://docs.ethers.org/v6/api/providers/#Signer)

## Methods

### approveAllCollectionItems

▸ **approveAllCollectionItems**(`collectionAddress`, `approved?`, `overrides?`): `Promise`<`ContractTransactionResponse`\>

Approve all the items of a collection, to eventually be traded on LooksRare
The spender is the TransferManager.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `collectionAddress` | `string` | `undefined` | Address of the collection to be approved. |
| `approved` | `boolean` | `true` | true to approve, false to revoke the approval (default to true) |
| `overrides?` | `Overrides` | `undefined` | - |

#### Returns

`Promise`<`ContractTransactionResponse`\>

ContractTransaction

___

### approveErc20

▸ **approveErc20**(`tokenAddress`, `amount?`, `overrides?`): `Promise`<`ContractTransactionResponse`\>

Approve an ERC20 to be used as a currency on LooksRare.
The spender is the LooksRareProtocol contract.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddress` | `string` | `undefined` | Address of the ERC20 to approve |
| `amount` | `bigint` | `MaxUint256` | Amount to be approved (default to MaxUint256) |
| `overrides?` | `Overrides` | `undefined` | - |

#### Returns

`Promise`<`ContractTransactionResponse`\>

ContractTransaction

___

### cancelAllOrders

▸ **cancelAllOrders**(`bid`, `ask`, `overrides?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Cancel all maker bid and/or ask orders for the current user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bid` | `boolean` | Cancel all bids |
| `ask` | `boolean` | Cancel all asks |
| `overrides?` | `Overrides` | - |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

ContractMethods

___

### cancelOrders

▸ **cancelOrders**(`nonces`, `overrides?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Cancel a list of specific orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nonces` | `BigNumberish`[] | List of nonces to be cancelled |
| `overrides?` | `Overrides` | - |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

ContractMethods

___

### cancelSubsetOrders

▸ **cancelSubsetOrders**(`nonces`, `overrides?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Cancel a list of specific subset orders

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nonces` | `BigNumberish`[] | List of nonces to be cancelled |
| `overrides?` | `Overrides` | - |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

ContractMethods

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

the maker object, isCurrencyApproved, and isBalanceSufficient

___

### createMakerCollectionOffer

▸ **createMakerCollectionOffer**(`orderInputs`): `Promise`<[`CreateMakerBidOutput`](../interfaces/types.CreateMakerBidOutput.md)\>

Create a maker bid for collection offer.

**`See`**

this.createMakerBid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderInputs` | [`CreateMakerCollectionOfferInput`](../modules/types.md#createmakercollectionofferinput) | Order data |

#### Returns

`Promise`<[`CreateMakerBidOutput`](../interfaces/types.CreateMakerBidOutput.md)\>

CreateMakerBidOutput

___

### createMakerCollectionOfferWithProof

▸ **createMakerCollectionOfferWithProof**(`orderInputs`): `Promise`<[`CreateMakerBidOutput`](../interfaces/types.CreateMakerBidOutput.md)\>

Create a maker bid for collection, with a list of item id that can be used for the taker order

**`See`**

this.createMakerBid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderInputs` | [`CreateMakerCollectionOfferWithProofInput`](../modules/types.md#createmakercollectionofferwithproofinput) | Order data |

#### Returns

`Promise`<[`CreateMakerBidOutput`](../interfaces/types.CreateMakerBidOutput.md)\>

CreateMakerBidOutput

___

### createTaker

▸ **createTaker**(`maker`, `recipient?`, `additionalParameters?`): [`Taker`](../interfaces/types.Taker.md)

Create a taker ask ready to be executed against a maker bid

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `maker` | [`Maker`](../interfaces/types.Maker.md) | `undefined` | Maker order that will be used as counterparty for the taker |
| `recipient` | `string` | `ZeroAddress` | Recipient address of the taker (if none, it will use the sender) |
| `additionalParameters` | `any`[] | `[]` | Additional parameters used to support complex orders |

#### Returns

[`Taker`](../interfaces/types.Taker.md)

Taker object

___

### createTakerCollectionOffer

▸ **createTakerCollectionOffer**(`maker`, `itemId`, `recipient?`): [`Taker`](../interfaces/types.Taker.md)

Create a taker ask order for collection order.

**`See`**

 - this.createTaker
 - this.createMakerCollectionOffer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maker` | [`Maker`](../interfaces/types.Maker.md) | - |
| `itemId` | `BigNumberish` | Token id to use as a counterparty for the collection order |
| `recipient?` | `string` | Recipient address of the taker (if none, it will use the sender) |

#### Returns

[`Taker`](../interfaces/types.Taker.md)

Taker object

___

### createTakerCollectionOfferWithProof

▸ **createTakerCollectionOfferWithProof**(`maker`, `itemId`, `itemIds`, `recipient?`): [`Taker`](../interfaces/types.Taker.md)

Create a taker ask to fulfill a collection order (maker bid) created with a whitelist of item ids

**`See`**

 - this.createTaker
 - this.createMakerCollectionOfferWithMerkleTree

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `maker` | [`Maker`](../interfaces/types.Maker.md) | - |
| `itemId` | `BigNumberish` | Token id to use as a counterparty for the collection order |
| `itemIds` | `BigNumberish`[] | List of token ids used during the maker creation |
| `recipient?` | `string` | Recipient address of the taker (if none, it will use the sender) |

#### Returns

[`Taker`](../interfaces/types.Taker.md)

Taker object

___

### executeMultipleOrders

▸ **executeMultipleOrders**(`orders`, `isAtomic`, `affiliate?`, `overrides?`): `Object`

Execute several orders

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `orders` | { `maker`: [`Maker`](../interfaces/types.Maker.md) ; `merkleTree?`: [`MerkleTree`](../interfaces/types.MerkleTree.md) ; `signature`: `string` ; `taker`: [`Taker`](../interfaces/types.Taker.md)  }[] | `undefined` | List of orders data |
| `isAtomic` | `boolean` | `undefined` | Should the transaction revert or not if a trade fails |
| `affiliate` | `string` | `ZeroAddress` | Affiliate address |
| `overrides?` | `Overrides` | `undefined` | Call overrides |

#### Returns

`Object`

ContractMethods

| Name | Type |
| :------ | :------ |
| `call` | (`additionalOverrides?`: `PayableOverrides`) => `Promise`<`ContractTransactionResponse`\> |
| `callStatic` | (`additionalOverrides?`: `PayableOverrides`) => `Promise`<`void`\> |
| `estimateGas` | (`additionalOverrides?`: `PayableOverrides`) => `Promise`<`bigint`\> |

___

### executeOrder

▸ **executeOrder**(`maker`, `taker`, `signature`, `merkleTree?`, `affiliate?`, `overrides?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Execute a trade

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `maker` | [`Maker`](../interfaces/types.Maker.md) | `undefined` | - |
| `taker` | [`Taker`](../interfaces/types.Taker.md) | `undefined` | Taker order |
| `signature` | `string` | `undefined` | Signature of the maker order |
| `merkleTree` | [`MerkleTree`](../interfaces/types.MerkleTree.md) | `defaultMerkleTree` | If the maker has been signed with a merkle tree |
| `affiliate` | `string` | `ZeroAddress` | Affiliate address if applicable |
| `overrides?` | `Overrides` | `undefined` | - |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

ContractMethods

___

### getSigner

▸ `Private` **getSigner**(): `Signer`

Return the signer it it's set, throw an exception otherwise

#### Returns

`Signer`

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

▸ **grantTransferManagerApproval**(`operators?`, `overrides?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Grant a list of operators the rights to transfer user's assets using the transfer manager

**`Default Value`**

Exchange address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operators` | `string`[] | List of operators (default to the exchange address) |
| `overrides?` | `Overrides` | - |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

ContractMethods

___

### isTimestampValid

▸ `Private` **isTimestampValid**(`timestamp`): `boolean`

Validate a timestamp format (seconds)

#### Parameters

| Name | Type |
| :------ | :------ |
| `timestamp` | `BigNumberish` |

#### Returns

`boolean`

boolean

___

### isTransferManagerApproved

▸ **isTransferManagerApproved**(`operator?`, `overrides?`): `Promise`<`boolean`\>

Check whether or not an operator has been approved by the user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operator` | `string` | Operator address (default to the exchange address) |
| `overrides?` | `Overrides` | - |

#### Returns

`Promise`<`boolean`\>

true if the operator is approved, false otherwise

___

### revokeTransferManagerApproval

▸ **revokeTransferManagerApproval**(`operators?`, `overrides?`): [`ContractMethods`](../interfaces/types.ContractMethods.md)

Revoke a list of operators the rights to transfer user's assets using the transfer manager

**`Default Value`**

Exchange address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operators` | `string`[] | List of operators |
| `overrides?` | `Overrides` | - |

#### Returns

[`ContractMethods`](../interfaces/types.ContractMethods.md)

ContractMethods

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

Signature, proofs, and Merkletree object

___

### strategyInfo

▸ **strategyInfo**(`strategyId`, `overrides?`): `Promise`<[`StrategyInfo`](../interfaces/types.StrategyInfo.md)\>

Retrieve strategy info

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `strategyId` | [`StrategyType`](../enums/types.StrategyType.md) | use the enum StrategyType |
| `overrides?` | `Overrides` | - |

#### Returns

`Promise`<[`StrategyInfo`](../interfaces/types.StrategyInfo.md)\>

StrategyInfo

___

### transferItemsAcrossCollection

▸ **transferItemsAcrossCollection**(`to`, `collectionItems`, `overrides?`): `Promise`<[`ContractMethods`](../interfaces/types.ContractMethods.md)\>

Transfer a list of items across different collections

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `to` | `string` | Recipient address |
| `collectionItems` | [`BatchTransferItem`](../interfaces/types.BatchTransferItem.md)[] | Each object in the array represent a list of items for a specific collection |
| `overrides?` | `Overrides` | - |

#### Returns

`Promise`<[`ContractMethods`](../interfaces/types.ContractMethods.md)\>

ContractMethods

___

### verifyMakerOrders

▸ **verifyMakerOrders**(`makerOrders`, `signatures`, `merkleTrees?`, `overrides?`): `Promise`<[`OrderValidatorCode`](../enums/types.OrderValidatorCode.md)[][]\>

Verify if a set of orders can be executed (i.e are valid)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `makerOrders` | [`Maker`](../interfaces/types.Maker.md)[] | List of maker orders |
| `signatures` | `string`[] | List of signatures |
| `merkleTrees?` | [`MerkleTree`](../interfaces/types.MerkleTree.md)[] | List of merkle trees (optional) |
| `overrides?` | `Overrides` | - |

#### Returns

`Promise`<[`OrderValidatorCode`](../enums/types.OrderValidatorCode.md)[][]\>

A list of OrderValidatorCode for each order (code 0 being valid)
