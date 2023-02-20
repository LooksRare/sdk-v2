# Interface: CreateMakerInput

[types](../modules/types.md).CreateMakerInput

Input of the createMakerAsk function

## Properties

### additionalParameters

• `Optional` **additionalParameters**: `any`[]

Additional parameters for complex orders

**`Default Value`**

[]

___

### amounts

• `Optional` **amounts**: `BigNumberish`[]

Amount for each item ids (needs to have the same length as itemIds array)

___

### collection

• **collection**: `string`

Collection address

___

### collectionType

• **collectionType**: [`CollectionType`](../enums/types.CollectionType.md)

Collection type, 0: ERC-721, 1:ERC-1155, etc

___

### currency

• `Optional` **currency**: `string`

Currency address

**`Default Value`**

ETH

___

### endTime

• **endTime**: `BigNumberish`

Timestamp in seconds when the order becomes invalid

___

### itemIds

• **itemIds**: `BigNumberish`[]

List of items ids to be sold

**`Default Value`**

[1]

___

### orderNonce

• **orderNonce**: `BigNumberish`

Order nonce, get it from the LooksRare api

___

### price

• **price**: `BigNumberish`

Asset price in wei

___

### startTime

• `Optional` **startTime**: `BigNumberish`

Order validity start time

**`Default Value`**

now

___

### strategyId

• **strategyId**: [`StrategyType`](../enums/types.StrategyType.md)

Strategy ID, 0: Standard, 1: Collection, etc

___

### subsetNonce

• **subsetNonce**: `BigNumberish`

Subset nonce used to group an arbitrary number of orders under the same nonce
