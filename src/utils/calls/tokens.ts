import { Contract, Provider, Overrides, ContractTransactionResponse, Signer } from "ethers";
import { ERC721 } from "../../typechain/solmate/src/tokens/ERC721.sol/ERC721";
import { ERC20 } from "../../typechain/solmate/src/tokens/ERC20";
import abiIERC721 from "../../abis/IERC721.json";
import abiIERC20 from "../../abis/IERC20.json";

// ER721 and ERC1155

export const setApprovalForAll = (
  signer: Signer,
  collection: string,
  operator: string,
  approved: boolean,
  overrides?: Overrides
): Promise<ContractTransactionResponse> => {
  const contract = new Contract(collection, abiIERC721).connect(signer) as ERC721;
  return contract.setApprovalForAll(operator, approved, { ...overrides });
};

export const isApprovedForAll = (
  signerOrProvider: Provider | Signer,
  collection: string,
  account: string,
  operator: string,
  overrides?: Overrides
): Promise<boolean> => {
  const contract = new Contract(collection, abiIERC721).connect(signerOrProvider) as ERC721;
  return contract.isApprovedForAll(account, operator, { ...overrides });
};

// ERC20

export const allowance = (
  signerOrProvider: Provider | Signer,
  currency: string,
  account: string,
  operator: string,
  overrides?: Overrides
): Promise<bigint> => {
  const contract = new Contract(currency, abiIERC20).connect(signerOrProvider) as ERC20;
  return contract.allowance(account, operator, { ...overrides });
};

export const approve = (
  signer: Signer,
  currency: string,
  operator: string,
  amount: bigint,
  overrides?: Overrides
): Promise<ContractTransactionResponse> => {
  const contract = new Contract(currency, abiIERC20).connect(signer) as ERC20;
  return contract.approve(operator, amount, { ...overrides });
};

export const balanceOf = (
  signerOrProvider: Provider | Signer,
  currency: string,
  account: string,
  overrides?: Overrides
): Promise<bigint> => {
  const contract = new Contract(currency, abiIERC20).connect(signerOrProvider) as ERC20;
  return contract.balanceOf(account, { ...overrides });
};
