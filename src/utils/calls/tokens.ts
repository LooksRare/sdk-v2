import { Contract, providers, Overrides, CallOverrides, constants, BigNumberish } from "ethers";
import { ERC721 } from "../../../typechain/solmate/src/tokens/ERC721.sol/ERC721";
import { ERC1155 } from "../../../typechain/solmate/src/tokens/ERC1155.sol";
import { ERC20 } from "../../../typechain/solmate/src/tokens/ERC20";
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
  const contract = new Contract(collection, abiIERC721, signer) as ERC721;
  return contract.setApprovalForAll(operator, approved, { ...overrides });
};

export const isApprovedForAll = (
  signerOrProvider: providers.Provider | Signer,
  collection: string,
  account: string,
  operator: string,
  overrides?: CallOverrides
) => {
  const contract = new Contract(collection, abiIERC721, signerOrProvider) as ERC721;
  return contract.isApprovedForAll(account, operator, { ...overrides });
};

export const balanceOf = (
  signerOrProvider: providers.Provider | Signer,
  collection: string,
  owner: string,
  tokenId?: BigNumberish
) => {
  if (tokenId === undefined) {
    const contract = new Contract(collection, abiIERC721, signerOrProvider) as ERC721;
    return contract.balanceOf(owner);
  }
  const contract = new Contract(collection, abiIERC1155, signerOrProvider) as ERC1155;
  return contract.balanceOf(owner, tokenId);
};

export const ownerOf = (signerOrProvider: providers.Provider | Signer, collection: string, tokenId: BigNumberish) => {
  const contract = new Contract(collection, abiIERC721, signerOrProvider) as ERC721;
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
  const contract = new Contract(currency, abiIERC20, signerOrProvider) as ERC20;
  return contract.allowance(account, operator, { ...overrides });
};

export const approve = (signer: Signer, currency: string, operator: string, overrides?: Overrides) => {
  const contract = new Contract(currency, abiIERC20, signer) as ERC20;
  return contract.approve(operator, constants.MaxUint256, { ...overrides });
};
