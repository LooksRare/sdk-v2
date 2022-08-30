import { TypedDataField } from "@ethersproject/abstract-signer";

export const contractName = "LooksRareProtocol";
export const version = 2;

export const makerAskTypes: Record<string, Array<TypedDataField>> = {
  MakerBid: [
    { name: "askNonce", type: "uint112" },
    { name: "subsetNonce", type: "uint112" },
    { name: "strategyId", type: "uint16" },
    { name: "assetType", type: "uint8" },
    { name: "orderNonce", type: "uint112" },
    { name: "minNetRatio", type: "uint16" },
    { name: "collection", type: "address" },
    { name: "currency", type: "address" },
    { name: "recipient", type: "address" },
    { name: "signer", type: "address" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "minPrice", type: "uint256" },
    { name: "itemIds", type: "uint256[]" },
    { name: "amounts", type: "uint256[]" },
    { name: "additionalParameters", type: "bytes" },
  ],
};

export const makerBidTypes: Record<string, Array<TypedDataField>> = {
  MakerBid: [
    { name: "bidNonce", type: "uint112" },
    { name: "subsetNonce", type: "uint112" },
    { name: "strategyId", type: "uint16" },
    { name: "assetType", type: "uint8" },
    { name: "orderNonce", type: "uint112" },
    { name: "minNetRatio", type: "uint16" },
    { name: "collection", type: "address" },
    { name: "currency", type: "address" },
    { name: "recipient", type: "address" },
    { name: "signer", type: "address" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "maxPrice", type: "uint256" },
    { name: "itemIds", type: "uint256[]" },
    { name: "amounts", type: "uint256[]" },
    { name: "additionalParameters", type: "bytes" },
  ],
};
