:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to cancel orders

## Cancel orders using order nonces

This method is used to invalidate the `orderNonce`. If multiple maker orders share the same nonce, they will all be cancelled and non-executable. An `orderNonce` is also invalidated once an order with that nonce is executed.

```ts
import { LooksRare, ChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(ChainId.MAINNET, provider, signer);

// Cancel order nonce 0
const tx = await lr.cancelOrders([0]).call();
const receipt = await tx.wait();

// Cancel order nonce 0 and 12
const tx = await lr.cancelOrders([0, 12]).call();
const receipt = await tx.wait();
```

## (Don't) Cancel orders using subset nonces

> NOTE: **Feature not implemented yet, DO NOT cancel subset nonces at this time.**

We restrict the `subsetNonce` at order creation to always be 0, at the moment.

The `subsetNonce` can only be invalidated/cancelled manually. The purpose of the `subsetNonce` is to allow the user to arbitrarily group different orders under the same `subsetNonce`, for example, all the orders from the same collection could have the same `subsetNonce`, allowing for a more targeted cancel functionality. _(pending implementation)_

## Cancel all your bids and/or all your asks

This function can be used to cancel all the sender's bids or all the sender's asks, or both in a single call. The following example showcases all the possible combinations.

```ts
import { LooksRare, ChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(ChainId.MAINNET, provider, signer);

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

For more details on our triple-nonce system, see the related documentation: [Triple-nonce system](https://docs.looksrare.org/developers/protocol/triple-nonce-system-v2)

## Need help?

You can reach out to the LooksRare team via our Developers Discord: [https://discord.gg/LooksRareDevelopers](https://discord.gg/LooksRareDevelopers)
