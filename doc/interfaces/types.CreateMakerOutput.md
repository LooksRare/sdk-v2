# Interface: CreateMakerOutput

[types](../modules/types.md).CreateMakerOutput

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

### maker

• **maker**: [`Maker`](types.Maker.md)

Maker order ready to be signed
