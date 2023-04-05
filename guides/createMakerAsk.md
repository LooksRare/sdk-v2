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
  const tx = await lr.grantTransferManagerApproval().call();
  await tx.wait();
}

// Approve the collection items to be transferred by the TransferManager
if (!isCollectionApproved) {
  const tx = await lr.approveAllCollectionItems(makerAsk.collection);
  await tx.wait();
}

// Sign your maker order
const signature = await lr.signMakerOrder(makerAsk);
```

> Once, the maker ask for your collection offer has been created, the approvals sorted and the order signed, you will have to send it along with the signature to the `POST /api/v2/orders` endpoint. For more details and examples, see [create order](https://looksrare.dev/v2/reference/createorder)).

## Need help?

You can reach out to the LooksRare team via our Developers Discord: [https://discord.gg/LooksRareDevelopers](https://discord.gg/LooksRareDevelopers)
