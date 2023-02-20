:warning: These code snippets are just examples and the data should never be used as is :warning:

# Verify order validity

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

const validatorCodes = await lr.verifyMakerOrders([makerOrder], [signature]);
```
