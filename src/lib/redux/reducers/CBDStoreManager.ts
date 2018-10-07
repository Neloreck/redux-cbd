import {Provider, createProvider} from "react-redux";

export abstract class CBDStoreManager {

  public abstract getStoreKey(): string;

  public abstract getStore(): void;

  public getProvider(): typeof Provider {
    return createProvider(this.getStoreKey())
  };

}