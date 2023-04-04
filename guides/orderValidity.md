:warning: These code snippets are just examples and the data should never be used as is :warning:

# Verify order validity

The LooksRare SDK also provides a method to validate your order. It can be used as follows:

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

const validatorCodes = await lr.verifyMakerOrders([makerOrder], [signature]);
```

To see all the possible validation codes, see the `OrderValidatorCode` enum located in [src/types.ts](../src/types.ts#L217).

## Need help?

You can reach out to the LooksRare team via our Developers Discord: [https://discord.gg/LooksRareDevelopers](https://discord.gg/LooksRareDevelopers)
