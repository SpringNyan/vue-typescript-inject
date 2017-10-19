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
export declare type Token = Object;
export declare type Type<T extends Object = Object> = new (...args: any[]) => T;
export declare type DependencyOptions = {
    token?: Token;
    optional?: boolean;
};
export declare type Dependencies = {
    [propertyKey: string]: DependencyOptions;
};
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
export declare function Injectable(): ClassDecorator;
export declare function Inject(token?: Token): PropertyDecorator;
export declare function Optional(): PropertyDecorator;
export declare class Injector {
    static readonly THROW_IF_NOT_FOUND: Object;
    readonly parent: Injector | null;
    private readonly _parent;
    private readonly _tokenProviderMap;
    private readonly _tokenInstanceMap;
    constructor(providers: Provider[], parent?: Injector);
    get(token: Token, notFoundValue?: any): any;
    private resolveProviderInstance(provider);
    private resolveTypeInstance(type);
    private resolveFactoryInstance(factory, deps?);
}
export default class VueTypeScriptInject {
    static install(Vue: VueClass): void;
}
