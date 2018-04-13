import { Token, Type } from "./declarations";
export declare type Provider = TypeProvider | ValueProvider | ClassProvider | ExistingProvider | FactoryProvider;
export declare type TypeProvider = Type;
export declare type ValueProvider = {
    provide: Token;
    useValue: any;
};
export declare type ClassProvider = {
    provide: Token;
    useClass: Type;
};
export declare type ExistingProvider = {
    provide: Token;
    useExisting: Token;
};
export declare type FactoryProvider = {
    provide: Token;
    useFactory: Function;
    deps?: Token[];
};
