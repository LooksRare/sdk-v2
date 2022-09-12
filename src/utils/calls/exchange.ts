import { Contract, Overrides, constants } from "ethers";
import { LooksRareProtocol } from "../../../typechain/contracts-exchange-v2/contracts/LooksRareProtocol";
import abiLooksRareProtocol from "../../abis/LooksRareProtocol.json";
import { MakerAsk, MakerBid, TakerAsk, TakerBid, Signer } from "../../types";

export const executeTakerBid = (
  signer: Signer,
  address: string,
  takerBid: TakerBid,
  makerAsk: MakerAsk,
  makerSignature: string,
  merkleRoot: string = constants.HashZero,
  merkleProof: string[] = [],
  referrer: string = constants.AddressZero,
  overrides?: Overrides
) => {
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return contract.executeTakerBid(takerBid, makerAsk, makerSignature, merkleRoot, merkleProof, referrer, {
    ...overrides,
  });
};

export const executeTakerAsk = (
  signer: Signer,
  address: string,
  takerAsk: TakerAsk,
  makerBid: MakerBid,
  makerSignature: string,
  merkleRoot: string = constants.HashZero,
  merkleProof: string[] = [],
  referrer: string = constants.AddressZero,
  overrides?: Overrides
) => {
  const contract = new Contract(address, abiLooksRareProtocol, signer) as LooksRareProtocol;
  return contract.executeTakerAsk(takerAsk, makerBid, makerSignature, merkleRoot, merkleProof, referrer, {
    ...overrides,
  });
};
