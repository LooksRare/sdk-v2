import { Addresses, ChainId } from "../types";

const mainnetAddresses: Addresses = {
  LOOKS: "0xf4d2888d29D722226FafA5d9B24F9164c092421E",
  EXCHANGE_V2: "0x0000000000E655fAe4d56241588680F86E3b2377",
  TRANSFER_MANAGER_V2: "0x000000000060C4Ca14CfC4325359062ace33Fe3D",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  ORDER_VALIDATOR_V2: "0x2a784a5b5C8AE0bd738FBc67E4C069dB4F4961B7",
  REVERSE_RECORDS: "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C",
  LOOKS_LP_V3: "0x4b5Ab61593A2401B1075b90c04cBCDD3F87CE011",
  STAKING_POOL_FOR_LOOKS_LP: "0x2A70e7F51f6cd40C3E9956aa964137668cBfAdC5",
  AGGREGATOR_UNISWAP_V3: "0x3ab16Af1315dc6C95F83Cbf522fecF98D00fd9ba",
};

const goerliAddresses: Addresses = {
  LOOKS: "0x20A5A36ded0E4101C3688CBC405bBAAE58fE9eeC",
  EXCHANGE_V2: "0x35C2215F2FFe8917B06454eEEaba189877F200cf",
  TRANSFER_MANAGER_V2: "0xC20E0CeAD98abBBEb626B77efb8Dc1E5D781f90c",
  WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  ORDER_VALIDATOR_V2: "0x7454Cc9AEB024bcE6A2CDC49ad4733B4D8215fb8",
  REVERSE_RECORDS: "0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e",
  LOOKS_LP_V3: "0x87C81267796Cd65347130e789CADdCdAf7bD2231",
  STAKING_POOL_FOR_LOOKS_LP: "",
  AGGREGATOR_UNISWAP_V3: "0x63c38B3BE3eF075a00a5edaeC36F499088c7334C",
};

const sepoliaAddresses: Addresses = {
  LOOKS: "0xa68c2CaA3D45fa6EBB95aA706c70f49D3356824E", // @note - not "LOOKS", but a test ERC20
  EXCHANGE_V2: "0x34098cc15a8a48Da9d3f31CC0F63F01f9aa3D9F3",
  TRANSFER_MANAGER_V2: "0xb46f116ecBa8451E661189F4b2B63aC60a618092",
  WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
  ORDER_VALIDATOR_V2: "0x0bc129E4c1f8D7b5583eAbAeb1F7468935B6ec0C",
  REVERSE_RECORDS: "",
  LOOKS_LP_V3: "",
  STAKING_POOL_FOR_LOOKS_LP: "",
  AGGREGATOR_UNISWAP_V3: "",
};

const arbitrumSepoliaAddresses: Addresses = {
  LOOKS: "0x0000000000000000000000000000000000000000", // bridged LOOKS
  EXCHANGE_V2: "",
  TRANSFER_MANAGER_V2: "0x21D44Cd218895d08bB57E2161A5c8De1CE898165",
  WETH: "",
  ORDER_VALIDATOR_V2: "",
  REVERSE_RECORDS: "",
  LOOKS_LP_V3: "",
  STAKING_POOL_FOR_LOOKS_LP: "",
  AGGREGATOR_UNISWAP_V3: "",
};

const arbitrumMainnetAddresses: Addresses = {
  LOOKS: "0x0000000000000000000000000000000000000000", // bridged LOOKS
  EXCHANGE_V2: "",
  TRANSFER_MANAGER_V2: "0x0000000000A3573e1caFe02fe1C3Ac48473C9332",
  WETH: "",
  ORDER_VALIDATOR_V2: "",
  REVERSE_RECORDS: "",
  LOOKS_LP_V3: "",
  STAKING_POOL_FOR_LOOKS_LP: "",
  AGGREGATOR_UNISWAP_V3: "",
};

/**
 * List of useful contract addresses
 */
export const addressesByNetwork: { [chainId in ChainId]: Addresses } = {
  [ChainId.MAINNET]: mainnetAddresses,
  [ChainId.GOERLI]: goerliAddresses,
  [ChainId.HARDHAT]: goerliAddresses,
  [ChainId.SEPOLIA]: sepoliaAddresses,
  [ChainId.ARB_SEPOLIA]: arbitrumSepoliaAddresses,
  [ChainId.ARB_MAINNET]: arbitrumMainnetAddresses,
};
