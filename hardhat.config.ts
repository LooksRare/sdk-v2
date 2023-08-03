import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-abi-exporter";

const config = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  abiExporter: {
    path: "./src/abis",
    runOnCompile: true,
    clear: true,
    flat: true,
    pretty: false,
    only: [
      "LooksRareProtocol",
      "TransferManager",
      "OrderValidatorV2A",
      "IERC721",
      "IERC1155",
      "IERC20",
      "WETH",
      "ProtocolHelpers",
    ],
  },
  typechain: {
    outDir: "src/typechain",
    target: "ethers-v6",
  },
  paths: {
    tests: "src/__tests__",
    artifacts: "src/artifacts",
    sources: "src/contracts",
  },
};

export default config;
