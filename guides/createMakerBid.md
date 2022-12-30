:warning: These code snippets are example and the data should never be used as it :warning:

# How to create a simple maker bid order

```ts
import { ethers } from "ethers";
import { LooksRare, SupportedChainId, AssetType, StrategyType } from "@looksrare/sdk-v2";

const lr = new LooksRare(SupportedChainId.MAINNET, provider, signer);

// To be done only once the first a user is interacting with the V2.
// It will grant the Exchange contract with the right to use your collections approvals done on the transfer manager.
await lr.grantTransferManagerApproval().call();

const { makerBid, approval } = await lr.createMakerBid({
  collection: "0x0000000000000000000000000000000000000000", // Collection address
  assetType: AssetType.ERC721,
  strategyId: StrategyType.standard,
  subsetNonce: 0, // keep 0 if you don't know what it is used for
  orderNonce: 0, // You need to retrieve this value from the API
  endTime: Math.floor(Date.now() / 1000), // If you use a timestamp in ms, the function will revert
  price: ethers.utils.parseEther("1"), // Be carefull to use a price in wei, this example is for 100 eth
  itemIds: [0], // Token id of the NFT you want to sell
  // Optional values
  amounts: [1], // Default to 1, use it for listing several ERC1155
  startTime: Math.floor(Date.now() / 1000), // Default to now, use it to create an order that will be valid in the future
});

// If you didn't approve your weth, the createMaker function populate an approval function for you.
// It will call the approve function with the max value.
if (approval) {
  await approval();
}

// Sign your maker order
const signature = await lr.signMakerBid(makerBid);
```
