import { SupportedChainId } from "../types";
import { Addresses } from "../types";

const mainnetAddresses: Addresses = {
  LOOKS: "",
  EXCHANGE_V2: "",
  TRANSFER_MANAGER_V2: "",
  WETH: "",
  ORDER_VALIDATOR_V2: "",
  REVERSE_RECORDS: "",
  LOOKS_LP_V3: "",
};

const goerliAddresses: Addresses = {
  LOOKS: "0x20A5A36ded0E4101C3688CBC405bBAAE58fE9eeC",
  EXCHANGE_V2: "0x35C2215F2FFe8917B06454eEEaba189877F200cf",
  TRANSFER_MANAGER_V2: "0xC20E0CeAD98abBBEb626B77efb8Dc1E5D781f90c",
  WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  ORDER_VALIDATOR_V2: "0x7454Cc9AEB024bcE6A2CDC49ad4733B4D8215fb8",
  REVERSE_RECORDS: "",
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
