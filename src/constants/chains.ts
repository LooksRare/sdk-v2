import { ChainId } from "../types";

interface ChainInfo {
  label: string;
  appUrl: string;
  rpcUrl: string;
  explorer: string;
  baseApiUrl: string;
  osApiUrl: string;
  cdnUrl: string;
  rewardsSubgraphUrl: string;
  cloudinaryUrl: string;
}

export const chainInfo: { [chainId in ChainId]: ChainInfo } = {
  [ChainId.MAINNET]: {
    label: "Ethereum",
    appUrl: "https://looksrare.org",
    explorer: "https://etherscan.io",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2",
    baseApiUrl: "https://graphql.looksrare.org",
    osApiUrl: "https://api.opensea.io",
    cdnUrl: "https://static.looksnice.org",
    rewardsSubgraphUrl: "https://api.thegraph.com/subgraphs/name/looksrare/looks-distribution",
    cloudinaryUrl: "https://looksrare.mo.cloudinary.net",
  },
  [ChainId.GOERLI]: {
    label: "Goerli",
    appUrl: "https://goerli.looksrare.org",
    explorer: "https://goerli.etherscan.io",
    rpcUrl: "https://eth-goerli.g.alchemy.com/v2",
    baseApiUrl: "https://graphql-goerli.looksrare.org",
    osApiUrl: "https://testnets-api.opensea.io",
    cdnUrl: "https://static-goerli.looksnice.org",
    rewardsSubgraphUrl: "https://api.thegraph.com/subgraphs/name/0xjurassicpunk/looks-distribution",
    cloudinaryUrl: "https://looksrare.mo.cloudinary.net/goerli",
  },
  [ChainId.SEPOLIA]: {
    label: "Sepolia",
    appUrl: "https://sepolia.looksrare.org",
    explorer: "https://sepolia.etherscan.io",
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2",
    baseApiUrl: "https://graphql-sepolia.looksrare.org",
    osApiUrl: "https://testnets-api.opensea.io",
    cdnUrl: "https://static-sepolia.looksnice.org",
    rewardsSubgraphUrl: "https://api.thegraph.com/subgraphs/name/0xjurassicpunk/looks-distribution",
    cloudinaryUrl: "https://looksrare.mo.cloudinary.net/sepolia",
  },
  [ChainId.HARDHAT]: {
    label: "Hardhat",
    appUrl: "http://localhost:3000",
    explorer: "https://etherscan.io",
    rpcUrl: "http://127.0.0.1:8545",
    baseApiUrl: "http://localhost:4000",
    osApiUrl: "https://testnets-api.opensea.io",
    cdnUrl: "https://via.placeholder.com",
    rewardsSubgraphUrl: "https://api.thegraph.com/subgraphs/name/0xjurassicpunk/looks-distribution",
    cloudinaryUrl: "",
  },
};
