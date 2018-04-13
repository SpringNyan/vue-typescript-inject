import { Token, DependencyOption } from "./declarations";
import { Provider } from "./providers";
import { InjectionToken } from "./token";
export declare class Injector {
    static readonly THROW_IF_NOT_FOUND: Object;
    readonly parent: Injector | null;
    private readonly _tokenProviderMap;
    private readonly _tokenInstanceMap;
    constructor(providers: Provider[], parent?: Injector | null);
    get<T>(token: InjectionToken<T>, notFoundValue?: T): T;
    get<T = any>(token: Token, notFoundValue?: T): T;
    getByOption(option: DependencyOption): any;
    private resolveProviderInstance(provider);
    private resolveTypeInstance(type);
    private resolveFactoryInstance(factory, deps?);
}
