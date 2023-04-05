:warning: These code snippets are just examples and the data should never be used as is :warning:

# Sign multiple maker orders with a single signature

> **This functionality is for UI implementations only. If you are using a bot, don't use the `signMultipleMakerOrders` function, just loop over the `createMakerBid` and `createMakerAsk` functions.**

The code snippet below is an example of how to sign multiple orders with one signature using Merkle trees via the `@looksrare/sdk-v2` library.

```ts
import { ethers } from "ethers";
import { LooksRare, ChainId, CollectionType, StrategyType } from "@looksrare/sdk-v2";

const lr = new LooksRare(ChainId.MAINNET, provider, signer);

const order1 = await lr.createMakerAsk(...);
const order2 = await lr.createMakerAsk(...);


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

const { signature, merkleTreeProofs } = await lr.signMultipleMakerOrders([order1.maker, order2.maker]);
```

> The orders, merkleTreeProofs and signature will have be sent to the `POST /api/v2/orders/tree` endpoint. For more details and examples, see [create Merkle tree order](https://looksrare.dev/v2/reference/createmerkletree)).

For more information on how to create your orders, see the [createMakerAsk](./createMakerAsk.md) and [createMakerBid](./createMakerBid.md) documentation.

## Need help?

You can reach out to the LooksRare team via our Developers Discord: [https://discord.gg/LooksRareDevelopers](https://discord.gg/LooksRareDevelopers)
