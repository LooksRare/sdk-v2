import { Contract, providers, BigNumberish, Overrides, CallOverrides } from "ethers";
import { IERC721 } from "../../../typechain/contracts-exchange-v2/contracts/interfaces/IERC721";
import { IERC1155 } from "../../../typechain/contracts-exchange-v2/contracts/interfaces/IERC1155";
import abiIERC721 from "../../abis/IERC721.json";
import abiIERC1155 from "../../abis/IERC1155.json";
import { Signer } from "../../types";

export const setApprovalForAll = (
  signer: Signer,
  collection: string,
  operator: string,
  approved = true,
  overrides?: Overrides
) => {
  const contract = new Contract(collection, abiIERC721, signer) as IERC721;
  return contract.setApprovalForAll(operator, approved, { ...overrides });
};

export const isApprovedForAll = (
  provider: providers.Provider,
  collection: string,
  account: string,
  operator: string,
  overrides?: CallOverrides
) => {
  const contract = new Contract(collection, abiIERC721, provider) as IERC721;
  return contract.isApprovedForAll(account, operator, { ...overrides });
};

export const balanceOf = (
  provider: providers.Provider,
  collection: string,
  owner: string,
  tokenId?: BigNumberish,
  overrides?: CallOverrides
) => {
  if (tokenId === undefined) {
    const contract = new Contract(collection, abiIERC721, provider) as IERC721;
    return contract.balanceOf(owner, { ...overrides });
  }
  const contract = new Contract(collection, abiIERC1155, provider) as IERC1155;
  return contract.balanceOf(owner, tokenId, { ...overrides });
};

export const ownerOf = (
  provider: providers.Provider,
  collection: string,
  tokenId: BigNumberish,
  overrides?: CallOverrides
) => {
  const contract = new Contract(collection, abiIERC721, provider) as IERC721;
  return contract.ownerOf(tokenId, { ...overrides });
};
