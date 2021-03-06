export type Token = Object;

export type Type<T extends Object = Object> = new (...args: any[]) => T;

export interface DependencyOption {
  token?: Token;
  optional?: boolean;
  notFoundValue?: any;
}

export interface DependencyOptions {
  [propertyKey: string]: DependencyOption;
}
