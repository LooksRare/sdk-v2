:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to cancel orders

## Cancel orders using order nonces

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// Cancel order nonce 0
const tx = await lr.cancelOrders([0]).call();
const receipt = await tx.wait();

// Cancel order nonce 0 and 12
const tx = await lr.cancelOrders([0, 12]).call();
const receipt = await tx.wait();
```

## Cancel orders using subset nonces

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// Cancel order with the subset nonce 0
const tx = await lr.cancelSubsetOrders([0]).call();
const receipt = await tx.wait();

// Cancel order with the subset 0 and 12
const tx = await lr.cancelSubsetOrders([0, 12]).call();
const receipt = await tx.wait();
```

## Cancel all your bids and/or all your asks

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// Cancel all bids
const tx = await lr.cancelAllOrders(true, false).call();
const receipt = await tx.wait();

// Cancel all asks
const tx = await lr.cancelAllOrders(false, true).call();
const receipt = await tx.wait();

// Cancel all bids and asks
const tx = await lr.cancelAllOrders(true, true).call();
const receipt = await tx.wait();
```
