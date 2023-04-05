:warning: These code snippets are just examples and the data should never be used as is :warning:

# Sign multiple maker orders with a single signature

**If you are using a bot, don't use the signMultipleMakerOrders function. Just loop over the `createMakerBid` and `createMakerAsk` functions.**

```ts
import { ethers } from "ethers";
import { LooksRare, SupportedChainId, CollectionType, StrategyType } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

const order1 = await lr.createMakerAsk(...);
const order2 = await lr.createMakerAsk(...);

const { signature, merkleTreeProofs } = await lrUser1.signMultipleMakerOrders([order1.maker, order2.maker]);
```

The `merkleTreeProofs` will need to be send to the backend during the order creation.

For more information on how to create your orders, see the [createMakerAsk doc](./createMakerAsk.md) and [createMakerBid doc](./createMakerBid.md).
