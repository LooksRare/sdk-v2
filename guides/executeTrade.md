:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to create a Taker order and execute a trade

Trades are executed on-chain by matching a `Maker` order with a `Taker` order. The maker order can be retrieved from the API, see [get v2 orders](https://looksrare.dev/v2/reference/getorders) for more details. While the taker order can be obtained by calling the `createTaker` method as shown here:

```ts
import { LooksRare, ChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(ChainId.MAINNET, provider, signer);

// The recipient address is optional, if you don't provide it will use your signer address
const takerOrder = lr.createTaker(makerOrder, recipientAddress);
```

From the API response, you will also get the `signature`, which is necessary to execute the trade on-chain. To execute the trade, you can call the `executeOrder` method passing the `Maker`, `Taker` and the `signature`. The method will return a contract call. Here is an example:

```ts
const { call } = lr.executeOrder(makerOrder, takerOrder, signature);
const tx = await call();
const receipt = await tx.wait();
```

## Need help?

You can reach out to the LooksRare team via our Developers Discord: [https://discord.gg/LooksRareDevelopers](https://discord.gg/LooksRareDevelopers)
