:warning: These code snippets are example and the data should never be used as it :warning:

# How to create a Taker order and execute a trade

Once you have the maker order (it can be retrieved from our api), you can create the correct Taker order as follow:

```ts
// The recipient address is that address that will receive the counterpart of the transaction (your address most of the time)
const takerBid = lr.createTakerBid(makerAsk, recipientAddress);
const takerAsk = lr.createTakerAsk(makerBid, recipientAddress);
```

Once you have the maker, the signature (both retrieved from the api), you can execute the trade as follow:

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
