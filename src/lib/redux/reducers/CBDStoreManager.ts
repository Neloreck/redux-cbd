import * as React from "react";
import {Fragment} from "react";

import {Store} from "redux";
import {createProvider} from "react-redux";

import {linkReactConnectWithStore} from "../utils/linkReactConnectWithStore";
import {EMetaData} from "../../general/type";

export abstract class CBDStoreManager<T> {

  protected store?: Store;

  public constructor() {
    const isStoreManaged: boolean = Reflect.getMetadata(EMetaData.STORE_MANAGED, this.constructor);

    if (!isStoreManaged) {
      throw new Error("You should decorate your store manager with @StoreManaged to provide store key and signleton pattern.");
    }
  }

  public getStoreKey(): string {
    return Reflect.getMetadata(EMetaData.STORE_KEY, this.constructor) || "store";
  };

  public getStore(): Store {
    if (!this.store) {
      this.store = this.createStore();
    }

    return this.store;
  }

  public getProviderComponent(): React.ComponentType {
    return (props: any) =>  React.createElement(Fragment, {},
      React.createElement(createProvider(this.getStoreKey()), { store: this.getStore() }, props.children));
  };

  public getConsumerAnnotation(): any {
    return linkReactConnectWithStore<T>(this.getStoreKey())
  }

  protected abstract createStore(): Store;

}