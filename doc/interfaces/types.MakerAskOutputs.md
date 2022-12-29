# Interface: MakerAskOutputs

[types](../modules/types.md).MakerAskOutputs

Output of the createMakerAsk function

## Properties

### approval

• `Optional` **approval**: () => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (): `Promise`<`ContractTransaction`\>

Function to be called before signing the order

##### Returns

`Promise`<`ContractTransaction`\>

___

### makerAsk

• **makerAsk**: [`MakerAsk`](types.MakerAsk.md)

Maker order ready to be signed
