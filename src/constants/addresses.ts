import { SupportedChainId } from "../types";
import { Addresses } from "../types";

const mainnetAddresses: Addresses = {
  LOOKS: "0xf4d2888d29D722226FafA5d9B24F9164c092421E",
  EXCHANGE_V2: "",
  TRANSFER_MANAGER_V2: "",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  ORDER_VALIDATOR_V2: "",
  REVERSE_RECORDS: "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C",
  LOOKS_LP_V3: "0xDC00bA87Cc2D99468f7f34BC04CBf72E111A32f7",
};

const goerliAddresses: Addresses = {
  LOOKS: "0x20A5A36ded0E4101C3688CBC405bBAAE58fE9eeC",
  EXCHANGE_V2: "0x35C2215F2FFe8917B06454eEEaba189877F200cf",
  TRANSFER_MANAGER_V2: "0xC20E0CeAD98abBBEb626B77efb8Dc1E5D781f90c",
  WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  ORDER_VALIDATOR_V2: "0x7454Cc9AEB024bcE6A2CDC49ad4733B4D8215fb8",
  REVERSE_RECORDS: "0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e",
  LOOKS_LP_V3: "",
};

/**
 * List of useful contract addresses
 */
export const addressesByNetwork: { [chainId in SupportedChainId]: Addresses } = {
  [SupportedChainId.MAINNET]: mainnetAddresses,
  [SupportedChainId.GOERLI]: goerliAddresses,
  [SupportedChainId.HARDHAT]: goerliAddresses,
};
