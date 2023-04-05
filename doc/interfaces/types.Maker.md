# Interface: Maker

[types](../modules/types.md).Maker

Maker object to be used in execute functions

## Properties

### additionalParameters

• **additionalParameters**: `BytesLike`

Additional parameters for complex orders

___

### amounts

• **amounts**: `BigNumberish`[]

List of amount for each item ID (1 for ERC721)

___

### collection

• **collection**: `string`

Collection address

___

### collectionType

• **collectionType**: [`CollectionType`](../enums/types.CollectionType.md)

Asset type, 0: ERC-721, 1:ERC-1155, etc

___

### currency

• **currency**: `string`

Currency address (zero address for ETH)

___

### endTime

• **endTime**: `BigNumberish`

Timestamp in second of the time when the order becomes invalid

___

### globalNonce

• **globalNonce**: `BigNumberish`

User's current bid / ask nonce

___

### itemIds

• **itemIds**: `BigNumberish`[]

List of item IDS

___

### orderNonce

• **orderNonce**: `BigNumberish`

Nonce for this specific order

___

### price

• **price**: `BigNumberish`

Minimum price to be received after the trade

___

### quoteType

• **quoteType**: [`QuoteType`](../enums/types.QuoteType.md)

Bid (0) or Ask (1)

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
