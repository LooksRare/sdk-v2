import { SupportedChainId } from "../types";

export interface Addresses {
  LOOKS: string;
  EXCHANGE: string;
  TRANSFER_MANAGER: string;
  WETH: string;
  ORDER_VALIDATOR: string;
  REVERSE_RECORDS: string;
  LOOKS_LP_V3: string;
}

const mainnetAddresses: Addresses = {
  LOOKS: "",
  EXCHANGE: "",
  TRANSFER_MANAGER: "",
  WETH: "",
  ORDER_VALIDATOR: "",
  REVERSE_RECORDS: "",
  LOOKS_LP_V3: "",
};

const goerliAddresses: Addresses = {
  LOOKS: "",
  EXCHANGE: "",
  TRANSFER_MANAGER: "",
  WETH: "",
  ORDER_VALIDATOR: "",
  REVERSE_RECORDS: "",
  LOOKS_LP_V3: "",
};

export const addressesByNetwork: { [chainId in SupportedChainId]: Addresses } = {
  [SupportedChainId.MAINNET]: mainnetAddresses,
  [SupportedChainId.GOERLI]: goerliAddresses,
  [SupportedChainId.HARDHAT]: goerliAddresses,
};
