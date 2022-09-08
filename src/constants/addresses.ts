import { SupportedChainId } from "../types";

export interface Addresses {
  LOOKS: string;
  EXCHANGE: string;
  TRANSFER_MANAGER: string;
}

const mainnetAddresses: Addresses = {
  LOOKS: "",
  EXCHANGE: "",
  TRANSFER_MANAGER: "",
};

const rinkebyAddresses: Addresses = {
  LOOKS: "",
  EXCHANGE: "",
  TRANSFER_MANAGER: "",
};

export const addressesByNetwork: { [chainId in SupportedChainId]: Addresses } = {
  [SupportedChainId.MAINNET]: mainnetAddresses,
  [SupportedChainId.RINKEBY]: rinkebyAddresses,
  [SupportedChainId.HARDHAT]: rinkebyAddresses,
};
