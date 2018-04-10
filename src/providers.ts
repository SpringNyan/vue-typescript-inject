import { Token, Type } from "./declarations";

export type Provider =
    | TypeProvider
    | ValueProvider
    | ClassProvider
    | ExistingProvider
    | FactoryProvider;

export type TypeProvider = Type;
export type ValueProvider = { provide: Token; useValue: any };
export type ClassProvider = { provide: Token; useClass: Type };
export type ExistingProvider = { provide: Token; useExisting: Token };
export type FactoryProvider = {
    provide: Token;
    useFactory: Function;
    deps?: Token[];
};
