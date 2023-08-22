import { BigNumberish, Contract, Overrides } from "ethers";
import { ERC721 } from "../../typechain/solmate/src/tokens/ERC721.sol/ERC721";
import abiIERC721 from "../../abis/IERC721.json";
import { Signer } from "../../types";

export const balanceOf = async (signer: Signer, contractAddress: string, owner?: string, overrides?: Overrides) => {
  const contract = new Contract(contractAddress, abiIERC721).connect(signer) as ERC721;
  return contract.balanceOf(owner ?? (await signer.getAddress()), { ...overrides });
};

export const ownerOf = async (signer: Signer, collection: string, id: BigNumberish, overrides?: Overrides) => {
  const contract = new Contract(collection, abiIERC721).connect(signer) as ERC721;
  return contract.ownerOf(id, { ...overrides });
};
