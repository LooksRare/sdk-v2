import { constants } from "ethers";

/** Maximum amount of orders in a merkle tree
 * This limit is enforced in the contract with the value 2^10 (=1024)
 * @see {@link https://github.com/LooksRare/contracts-exchange-v2/blob/master/contracts/constants/NumericConstants.sol#L7}
 */
export const MAX_ORDERS_PER_TREE = 1024;

/**
 * Default merkle tree value used when the merkle tree can be omitted.
 */
export const defaultMerkleTree = { root: constants.HashZero, proof: [] };

export { addressesByNetwork } from "./addresses";
export { chainInfo } from "./chains";
