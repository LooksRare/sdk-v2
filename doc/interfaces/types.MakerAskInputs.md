# Interface: MakerAskInputs

[types](../modules/types.md).MakerAskInputs

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

### assetType

• **assetType**: [`AssetType`](../enums/types.AssetType.md)

Asset type

___

### collection

• **collection**: `string`

Collection address

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

Order nonce

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

Strategy ID

___

### subsetNonce

• **subsetNonce**: `BigNumberish`

Subset nonce
