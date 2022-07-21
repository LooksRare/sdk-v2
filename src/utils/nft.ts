import { ethers, Contract, BigNumberish } from "ethers";
import { IERC721 } from "../../typechain/contracts-exchange-v2/contracts/interfaces/IERC721";
import { IERC1155 } from "../../typechain/contracts-exchange-v2/contracts/interfaces/IERC1155";
import abiIERC721 from "../abis/IERC721.json";
import abiIERC1155 from "../abis/IERC1155.json";

export const setApprovalForAll = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  collection: string,
  operator: string,
  approved = true
) => {
  const contract = new Contract(collection, abiIERC721, signerOrProvider) as IERC721;
  return contract.setApprovalForAll(operator, approved);
};

export const isApprovedForAll = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  collection: string,
  account: string,
  operator: string
) => {
  const contract = new Contract(collection, abiIERC721, signerOrProvider) as IERC721;
  return contract.isApprovedForAll(account, operator);
};

export const balanceOf = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  collection: string,
  owner: string,
  tokenId?: BigNumberish
) => {
  if (tokenId === undefined) {
    const contract = new Contract(collection, abiIERC721, signerOrProvider) as IERC721;
    return contract.balanceOf(owner);
  }
  const contract = new Contract(collection, abiIERC1155, signerOrProvider) as IERC1155;
  return contract.balanceOf(owner, tokenId);
};

export const ownerOf = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  collection: string,
  tokenId: BigNumberish
) => {
  const contract = new Contract(collection, abiIERC721, signerOrProvider) as IERC721;
  return contract.ownerOf(tokenId);
};
