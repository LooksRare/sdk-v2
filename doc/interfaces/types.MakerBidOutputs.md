# Interface: MakerBidOutputs

[types](../modules/types.md).MakerBidOutputs

Output of the createMakerBid function

## Properties

### approval

• `Optional` **approval**: () => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (): `Promise`<`ContractTransaction`\>

Function to be called before signing the order

##### Returns

`Promise`<`ContractTransaction`\>

___

### makerBid

• **makerBid**: [`MakerBid`](types.MakerBid.md)

Maker order ready to be signed
