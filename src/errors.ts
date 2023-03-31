import { MAX_ORDERS_PER_TREE } from "./constants";

/** Invalid timestamp format */
export class ErrorTimestamp extends Error {
  public readonly name = "ErrorTimestamp";
  constructor() {
    super("Timestamps should be in seconds");
  }
}

/** Undefined signer */
export class ErrorSigner extends Error {
  public readonly name = "ErrorSigner";
  constructor() {
    super("Signer is undefined");
  }
}

/** Too many orders in one merkle tree */
export class ErrorMerkleTreeDepth extends Error {
  public readonly name = "ErrorMerkleTreeDepth";
  constructor() {
    super(`Too many orders (limit: ${MAX_ORDERS_PER_TREE})`);
  }
}

/** Wrong quote type */
export class ErrorQuoteType extends Error {
  public readonly name = "ErrorQuoteType";
  constructor() {
    super("Wrong quote type");
  }
}

/** Wrong strategy type */
export class ErrorStrategyType extends Error {
  public readonly name = "ErrorStrategyType";
  constructor() {
    super("Wrong strategy type");
  }
}

/** Invalid item ID for orders with proof */
export class ErrorItemId extends Error {
  public readonly name = "ErrorItemId";
  constructor() {
    super("Item id is not in the list");
  }
}
