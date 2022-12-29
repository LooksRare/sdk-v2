# Interface: MakerBid

[types](../modules/types.md).MakerBid

Maker bid object to be used in execute functions

## Properties

### additionalParameters

• **additionalParameters**: `BytesLike`

Additional parameters for complex orders

___

### amounts

• **amounts**: `BigNumberish`[]

List of amount for each item ID (1 for ERC721)

___

### assetType

• **assetType**: [`AssetType`](../enums/types.AssetType.md)

Asset type, 0: ERC-721, 1:ERC-1155, etc

___

### bidNonce

• **bidNonce**: `BigNumberish`

User's current bid nonce

___

### collection

• **collection**: `string`

Collection address

___

### currency

• **currency**: `string`

Currency address (zero address for ETH)

___

### endTime

• **endTime**: `BigNumberish`

Timestamp in second of the time when the order becomes invalid

___

### itemIds

• **itemIds**: `BigNumberish`[]

List of item IDS

___

### maxPrice

• **maxPrice**: `BigNumberish`

Maximum price to be paid for the trade

___

### orderNonce

• **orderNonce**: `BigNumberish`

Nonce for this specific order

___

### signer

• **signer**: `string`

Signer address

___

### startTime

• **startTime**: `BigNumberish`

Timestamp in second of the time when the order starts to be valid

___

### strategyId

• **strategyId**: [`StrategyType`](../enums/types.StrategyType.md)

Strategy ID, 0: Standard, 1: Collection, etc

___

### subsetNonce

• **subsetNonce**: `BigNumberish`

Subset nonce used to group an arbitrary number of orders under the same nonce
