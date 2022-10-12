# Interface: MakerAskOutputs

[types](../modules/types.md).MakerAskOutputs

Output of the createMakerAsk function

## Properties

### action

• `Optional` **action**: () => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (): `Promise`<`ContractTransaction`\>

Function to be called before signing the order

##### Returns

`Promise`<`ContractTransaction`\>

___

### order

• **order**: [`MakerAsk`](types.MakerAsk.md)

Maker order ready to be signed
