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
  LOOKS: "",
  EXCHANGE_V2: "",
  TRANSFER_MANAGER_V2: "",
  WETH: "",
  ORDER_VALIDATOR_V2: "",
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
