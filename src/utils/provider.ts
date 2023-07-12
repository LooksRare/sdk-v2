import { FetchRequest, JsonRpcApiProviderOptions, JsonRpcProvider, Networkish } from "ethers";

export class BatchProvider extends JsonRpcProvider {
  constructor(url?: string | FetchRequest, network?: Networkish, options?: JsonRpcApiProviderOptions) {
    super(url, network, options);
  }
}
