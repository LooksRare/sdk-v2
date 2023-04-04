:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to create a maker ask order

The code snippet below is an example of how to create a maker ask using the `@looksrare/sdk-v2` library.

The main steps are:

1. Initialize a LooksRare class instance by providing the chain id, [RPC provider](https://docs.ethers.io/v5/api/providers/) and a [signer](https://docs.ethers.io/v5/api/signer/).
2. Use the `createMakerAsk` method to create a maker ask with the parameters of your order.
3. Check and grant necessary approvals for transferring assets.
4. Sign the maker ask order with `signMakerOrder` method.

> The `orderNonce` has to be retrieved via our Public API, see [get order nonce](https://looksrare.dev/v2/reference/getordernonce).

Here is an example:

```ts
import { ethers } from "ethers";
import { LooksRare, SupportedChainId, CollectionType, StrategyType } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

const { makerAsk, isCollectionApproved, isTransferManagerApproved } = await lr.createMakerAsk({
  collection: "0x0000000000000000000000000000000000000000", // Collection address
  collectionType: CollectionType.ERC721,
  strategyId: StrategyType.standard,
  subsetNonce: 0, // keep 0 if you don't know what it is used for
  orderNonce: 0, // You need to retrieve this value from the API
  endTime: Math.floor(Date.now() / 1000) + 86400, // If you use a timestamp in ms, the function will revert
  price: ethers.utils.parseEther("1"), // Be careful to use a price in wei, this example is for 1 ETH
  itemIds: [0], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
  amounts: [1], // Use it for listing multiple ERC-1155 (Optional, Default to [1])
  startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
});

// Grant the TransferManager the right the transfer assets on behalf od the LooksRareProtocol
if (!isTransferManagerApproved) {
  // Send approval transaction on-chain
  const tx = await lr.grantTransferManagerApproval().call();

  // Wait for the transaction to be processed
  await tx.wait();
}

// Approve the collection items to be transfered by the TransferManager
if (!isCollectionApproved) {
  // Send approval transaction on-chain
  const tx = await lr.approveAllCollectionItems(makerAsk.collection);

  // Wait for the transaction to be processed
  await tx.wait();
}

// Sign your maker order
const signature = await lr.signMakerOrder(makerAsk);
```

## How to send the order via our Public API

Once the maker ask has been created, the approvals sorted and the order signed, you will have to send the resulting order to the `POST /api/v2/orders` endpoint (see [create order](https://looksrare.dev/v2/reference/createorder)).

Here is an example of how you can achieve that:

```ts
// In this example axios is being used, but you can use any http client
import axios from "axios";

/**
 * Generate the maker ask, sort the approvals and sign the order here. As shown in the example above.
 */

// Cast the globalNonce and price to string as expected by the API
const order = { ...makerAsk, globalNonce: makerAsk.globalNonce.toString(), price: makerAsk.price.toString() };

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

## Need help?

You can reach out to the LooksRare team via our Developers Discord: [https://discord.gg/LooksRareDevelopers](https://discord.gg/LooksRareDevelopers)
