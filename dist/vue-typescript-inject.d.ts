import "reflect-metadata";
import Vue from "vue";
declare module "vue/types/vue" {
    interface Vue {
        readonly $injector: Injector;
    }
}
declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        dependencies?: Dependencies;
        providers?: Provider[];
    }
}
export declare type VueClass = typeof Vue;
export declare type Type<T extends Object = Object> = new (...args: any[]) => T;
export declare type Dependencies = {
    [propertyKey: string]: Object;
};
export declare type Provider = TypeProvider | ValueProvider | ClassProvider | ExistingProvider | FactoryProvider;
export declare type TypeProvider = Type;
export declare type ValueProvider = {
    provide: Object;
    useValue: any;
};
export declare type ClassProvider = {
    provide: Object;
    useClass: Type;
};
export declare type ExistingProvider = {
    provide: Object;
    useExisting: Object;
};
export declare type FactoryProvider = {
    provide: Object;
    useFactory: Function;
    deps?: Object[];
};
export declare function Injectable(): ClassDecorator;
export declare function Inject(token?: Object): PropertyDecorator;
export declare class TokenNotFoundError extends Error {
    constructor(message?: string);
}
export declare class Injector {
    readonly parent: Injector | null;
    private readonly _parent;
    private readonly _tokenProviderMap;
    private readonly _tokenInstanceMap;
    constructor(providers: Provider[], parent?: Injector);
    get(token: Object): any;
    private resolveProviderInstance(provider);
    private resolveTypeInstance(type);
    private resolveFactoryInstance(factory, deps?);
}
export default class VueTypeScriptInject {
    static install(Vue: VueClass): void;
}
