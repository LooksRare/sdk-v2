import { Contract, providers, Overrides, CallOverrides, constants, BigNumberish } from "ethers";
import { IERC721 } from "../../../typechain/contracts-exchange-v2/contracts/interfaces/IERC721";
import { IERC1155 } from "../../../typechain/contracts-exchange-v2/contracts/interfaces/IERC1155";
import { IERC20 } from "../../../typechain/contracts-exchange-v2/contracts/interfaces/IERC20";
import abiIERC721 from "../../abis/IERC721.json";
import abiIERC1155 from "../../abis/IERC1155.json";
import abiIERC20 from "../../abis/IERC20.json";
import { Signer } from "../../types";

// ER721 and ERC1155

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
  signerOrProvider: providers.Provider | Signer,
  collection: string,
  account: string,
  operator: string,
  overrides?: CallOverrides
) => {
  const contract = new Contract(collection, abiIERC721, signerOrProvider) as IERC721;
  return contract.isApprovedForAll(account, operator, { ...overrides });
};

export const balanceOf = (
  signerOrProvider: providers.Provider | Signer,
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

export const ownerOf = (signerOrProvider: providers.Provider | Signer, collection: string, tokenId: BigNumberish) => {
  const contract = new Contract(collection, abiIERC721, signerOrProvider) as IERC721;
  return contract.ownerOf(tokenId);
};

// ERC20

export const allowance = (
  signerOrProvider: providers.Provider | Signer,
  currency: string,
  account: string,
  operator: string,
  overrides?: Overrides
) => {
  const contract = new Contract(currency, abiIERC20, signerOrProvider) as IERC20;
  return contract.allowance(account, operator, { ...overrides });
};

export const approve = (signer: Signer, currency: string, operator: string, overrides?: Overrides) => {
  const contract = new Contract(currency, abiIERC20, signer) as IERC20;
  return contract.approve(operator, constants.MaxUint256, { ...overrides });
};
