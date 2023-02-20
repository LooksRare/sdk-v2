:warning: These code snippets are just examples and the data should never be used as is :warning:

# How to create a maker ask order

```ts
import { ethers } from "ethers";
import { LooksRare, SupportedChainId, CollectionType, StrategyType } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// To be done only once the first a user is interacting with the V2.
// It will grant the Exchange contract with the right to use your collections approvals done on the transfer manager.
await lr.grantTransferManagerApproval().call();

const { makerAsk, approval } = await lr.createMakerAsk({
  collection: "0x0000000000000000000000000000000000000000", // Collection address
  collectionType: CollectionType.ERC721,
  strategyId: StrategyType.standard,
  subsetNonce: 0, // keep 0 if you don't know what it is used for
  orderNonce: 0, // You need to retrieve this value from the API
  endTime: Math.floor(Date.now() / 1000), // If you use a timestamp in ms, the function will revert
  price: ethers.utils.parseEther("1"), // Be careful to use a price in wei, this example is for 1 ETH
  itemIds: [0], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
  amounts: [1], // Use it for listing multiple ERC-1155 (Optional, Default to [1])
  startTime: Math.floor(Date.now() / 1000), // Use it to create an order that will be valid in the future (Optional, Default to now)
});

// If you didn't approve this NFT collection before, the createMaker function populate an approval function for you.
// It will call the setApprovalForAll function with the right parameters.
if (approval) {
  await approval();
}

// Sign your maker order
const signature = await lr.signMakerAsk(makerAsk);
```

# How to create a maker ask order for bundle

To create a bundle, provide several items ids (don't forget to add the correct amount for each token id). You cannot create cross collection bundles.

```ts
{
    ...
    itemIds: [0, 1, 5],
    amounts: [1, 1, 1],
    ...
}
```
