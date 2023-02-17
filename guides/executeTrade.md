:warning: These code snippets are example and the data should never be used as it :warning:

# How to create a Taker order and execute a trade

Once you have the maker order (it can be retrieved from our api), you can create the correct Taker order as follow:

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// The recipient address is optional, if you don't provide it will use your signer address
const takerOrder = lr.createTaker(makerAsk, recipientAddress);
```

Once you have the maker order and the signature (both retrieved from the api), you can execute the trade as follow:

```ts
const { call } = lr.executeTakerBid(makerAsk, takerBid, signature);
const tx = await call();
const receipt = await tx.wait();
```

```ts
const { call } = lr.executeTakerAsk(makerBid, takerAsk, signature);
const tx = await call();
const receipt = await tx.wait();
```
