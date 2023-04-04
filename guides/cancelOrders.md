:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to cancel orders

## Cancel orders using order nonces

This method is used to invalidate the `orderNonce`. If multiple maker orders share the same nonce, they will all be cancelled and non-executable. An `orderNonce` is also invalidated once an order with that nonce is executed.

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// Cancel order nonce 0
const tx = await lr.cancelOrders([0]).call();

// Wait for the transaction to be processed
const receipt = await tx.wait();

// Cancel order nonce 0 and 12
const tx = await lr.cancelOrders([0, 12]).call();

// Wait for the transaction to be processed
const receipt = await tx.wait();
```

## Cancel orders using subset nonces

The `subsetNonce` can only be invalidated/cancelled manually. The purpose of the `subsetNonce` is to allow the user to arbitrarily group different orders under the same `subsetNonce`, for example, all the orders from the same collection could have the same `subsetNonce`, allowing for a more targeted cancel functionality.

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// Cancel order with the subset nonce 0
const tx = await lr.cancelSubsetOrders([0]).call();

// Wait for the transaction to be processed
const receipt = await tx.wait();

// Cancel order with the subset 0 and 12
const tx = await lr.cancelSubsetOrders([0, 12]).call();

// Wait for the transaction to be processed
const receipt = await tx.wait();
```

## Cancel all your bids and/or all your asks

This function can be used to cancel all the sender's bids or all the sender's asks, or both in a single call. The following example showcases all the possible combinations.

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// Cancel all bids
const tx = await lr.cancelAllOrders(true, false).call();

// Wait for the transaction to be processed
const receipt = await tx.wait();

// Cancel all asks
const tx = await lr.cancelAllOrders(false, true).call();

// Wait for the transaction to be processed
const receipt = await tx.wait();

// Cancel all bids and asks
const tx = await lr.cancelAllOrders(true, true).call();

// Wait for the transaction to be processed
const receipt = await tx.wait();
```

For more details on our triple-nonce system, see the related documentation: [Triple-nonce system](https://docs.looksrare.org/developers/protocol/triple-nonce-system-v2)

## Need help?

You can reach out to the LooksRare team via our Developers Discord: [https://discord.gg/LooksRareDevelopers](https://discord.gg/LooksRareDevelopers)
