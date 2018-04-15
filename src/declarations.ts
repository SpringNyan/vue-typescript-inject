export type Token = Object;

export type Type<T extends Object = Object> = new (...args: any[]) => T;

export interface DependencyOption {
  token?: Token;
  optional?: boolean;
}

export interface DependencyOptions {
  [propertyKey: string]: DependencyOption;
}
