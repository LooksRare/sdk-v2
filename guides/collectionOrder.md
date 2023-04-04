:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to create a collection offer (maker bid with collection strategy)

The code snippet below is an example of how to create a maker bid using the `@looksrare/sdk-v2` library.

> A collection order is just a maker bid order using the `StrategyType.collection`.

The main steps are:

1. Initialize a LooksRare class instance by providing the chain id, [RPC provider](https://docs.ethers.io/v5/api/providers/) and a [signer](https://docs.ethers.io/v5/api/signer/).
2. Use the `createMakerCollectionOffer` method to create a maker ask with the parameters of your order.
3. Check and grant necessary approvals for transferring assets.
4. Sign the maker bid order with `signMakerOrder` method.

Here is an example:

```ts
import { ethers } from "ethers";
import { LooksRare, SupportedChainId, CollectionType, StrategyType } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

const { makerBid, isCurrencyApproved } = await lr.createMakerCollectionOffer({
  collection: "0x0000000000000000000000000000000000000000", // Collection address
  collectionType: CollectionType.ERC721,
  subsetNonce: 0, // keep 0 if you don't know what it is used for
  orderNonce: 0, // You need to retrieve this value from the API
  endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
  price: ethers.utils.parseEther("1"), // Be careful to use a price in wei, this example is for 1 ETH
  amounts: [1], // Use it for listing multiple ERC-1155 (Optional, Default to [1])
  startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
});

// Approve spending of the currency used for bidding
if (!isCurrencyApproved) {
  // Send approval transaction on-chain
  const tx = await lr.approveErc20(lr.addresses.WETH);

  // Wait for the transaction to be processed
  await tx.wait();
}

// Sign your maker order
const signature = await lr.signMakerOrder(makerBid);
```

# How to send the order via our Public API

Once, the maker bid for your collection offer has been created, the approvals sorted and the order signed, you will have to send the resulting order to the `POST /api/v2/orders` endpoint (see [create order](https://looksrare.dev/v2/reference/createorder)).

Here is an example of how you can achieve that:

```ts
// In this example axios is being used, but you can use any http client
import axios from "axios";

/**
 * Generate the maker ask, sort the approvals and sign the order here. As shown in the example above.
 */

// Cast the globalNonce and price to string as expected by the API
const order = { ...makerBid, globalNonce: makerAsk.globalNonce.toString(), price: makerAsk.price.toString() };

await axios.post(
  `https://api.looksrare.org/api/v2/orders`, // For Goerli use https://api-goerli.looksrare.org/api/v2/orders
  { ...order, signature },
  {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-Looks-Api-Key": "YOUR_API_KEY", // Remove the header if on Goerli
    },
  }
);
```

For more details, see our API reference: [https://looksrare.dev](https://looksrare.dev)

# How to execute a collection offer

`createTakerForCollectionOrder` is just a convenient wrapper around `createTaker`.

```ts
import { LooksRare, SupportedChainId } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// To be done only once the first a user is interacting with the V2.
// It will grant the Exchange contract with the right to use your collections approvals done on the transfer manager.
await lr.grantTransferManagerApproval().call();
await setApprovalForAll(signer, maker.collection, lr.addresses.TRANSFER_MANAGER_V2);

const taker = lr.createTakerForCollectionOrder(maker, TOKEN_ID); // Change the token id

// Generate the contract call
const { call } = lr.executeOrder(maker, taker, signature);

// Send the transaction on-chain
const tx = await call();

// Wait for the transaction to be processed
const receipt = await tx.wait();
```

## Need help?

You can reach out to the LooksRare team via our Developers Discord: [https://discord.gg/LooksRareDevelopers](https://discord.gg/LooksRareDevelopers)
