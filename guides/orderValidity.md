:warning: These code snippets are example and the data should never be used as it :warning:

# Verify order validity

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

const validatorCodes = await lr.verifyMakerOrders([makerOrder], [signature]);
```
