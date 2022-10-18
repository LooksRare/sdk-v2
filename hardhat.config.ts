import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-abi-exporter";

const config: HardhatUserConfig = {
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
    except: ["contracts/tests/*", "@rari-capital"],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  paths: {
    tests: "src/__tests__",
    artifacts: "artifacts",
    sources: "src/contracts",
  },
};

export default config;
