import Vue, { VueConstructor } from "vue";
declare module "vue/types/vue" {
    interface Vue {
        readonly $injector: Injector;
    }
}
declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        dependencies?: DependencyOptions;
        providers?: Provider[];
    }
}
export declare type Token = Object;
export declare type Type<T extends Object = Object> = new (...args: any[]) => T;
export declare type DependencyOption = {
    token?: Token;
    optional?: boolean;
};
export declare type DependencyOptions = {
    [propertyKey: string]: DependencyOption;
};
export declare type VueDecorator = (target: Vue, propertyKey: string) => void;
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
export declare function injectable(): ClassDecorator;
export declare function inject(token?: Token): VueDecorator;
export declare function optional(): VueDecorator;
export declare class Injector {
    static readonly THROW_IF_NOT_FOUND: Object;
    readonly parent: Injector | null;
    private readonly _parent;
    private readonly _tokenProviderMap;
    constructor(providers: Provider[], parent?: (Injector | null) | (() => Injector | null));
    get(token: Token, notFoundValue?: any): any;
    private resolveProviderInstance(provider);
    private resolveTypeInstance(type);
    private resolveFactoryInstance(factory, deps?);
}
export default class VueTypeScriptInject {
    static install(Vue: VueConstructor): void;
}
