# Interface: ContractMethods

[types](../modules/types.md).ContractMethods

Return type for any on chain call

## Properties

### call

• **call**: (`additionalOverrides?`: `Overrides`) => `Promise`<`ContractTransactionResponse`\>

#### Type declaration

▸ (`additionalOverrides?`): `Promise`<`ContractTransactionResponse`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `additionalOverrides?` | `Overrides` |

##### Returns

`Promise`<`ContractTransactionResponse`\>

___

### callStatic

• **callStatic**: (`additionalOverrides?`: `Overrides`) => `Promise`<`any`\>

#### Type declaration

▸ (`additionalOverrides?`): `Promise`<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `additionalOverrides?` | `Overrides` |

##### Returns

`Promise`<`any`\>

___

### estimateGas

• **estimateGas**: (`additionalOverrides?`: `Overrides`) => `Promise`<`bigint`\>

#### Type declaration

▸ (`additionalOverrides?`): `Promise`<`bigint`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `additionalOverrides?` | `Overrides` |

##### Returns

`Promise`<`bigint`\>
