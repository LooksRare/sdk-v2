import { Contract, providers, Overrides, CallOverrides, BigNumber } from "ethers";
import { ERC721 } from "../../typechain/solmate/src/tokens/ERC721.sol/ERC721";
import { ERC20 } from "../../typechain/solmate/src/tokens/ERC20";
import abiIERC721 from "../../abis/IERC721.json";
import abiIERC20 from "../../abis/IERC20.json";
import { Signer } from "../../types";

// ER721 and ERC1155

export const setApprovalForAll = (
  signer: Signer,
  collection: string,
  operator: string,
  approved: boolean,
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

export const approve = (
  signer: Signer,
  currency: string,
  operator: string,
  amount: BigNumber,
  overrides?: Overrides
) => {
  const contract = new Contract(currency, abiIERC20, signer) as ERC20;
  return contract.approve(operator, amount, { ...overrides });
};
