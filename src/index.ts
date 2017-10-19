import Vue from "vue";
import { createDecorator } from "vue-class-component";

declare module "vue/types/vue" {
    export interface Vue {
        readonly $injector: Injector;
    }
}

declare module "vue/types/options" {
    export interface ComponentOptions<V extends Vue> {
        dependencies?: Dependencies;
        providers?: Provider[];
    }
}

export type VueClass = typeof Vue;
export type Token = Object;
export type Type<T extends Object = Object> = new (...args: any[]) => T;

export type DependencyOptions = {
    token?: Token;
    optional?: boolean;
};
export type Dependencies = { [propertyKey: string]: DependencyOptions };

export type Provider = TypeProvider | ValueProvider | ClassProvider | ExistingProvider | FactoryProvider;
export type TypeProvider = Type;
export type ValueProvider = { provide: Token; useValue: any; };
export type ClassProvider = { provide: Token; useClass: Type; };
export type ExistingProvider = { provide: Token; useExisting: Token; };
export type FactoryProvider = { provide: Token; useFactory: Function; deps?: Token[]; };

const injectableDecorator = () => undefined;
export function Injectable(): ClassDecorator {
    return injectableDecorator;
}

export function Inject(token?: Token): PropertyDecorator {
    return (target: Vue, propertyKey: string) => {
        if (token === undefined) {
            token = Reflect.getMetadata("design:type", target, propertyKey);
            if (token == null) {
                throw new Error("Type metadata is not found.");
            }
        }
        if (token === null) {
            throw new Error("Token should not be `null`.");
        }

        const decorator = createDecorator((options, key) => {
            if (options.dependencies == null) {
                options.dependencies = {};
            }

            if (options.dependencies[key] == null) {
                options.dependencies[key] = {};
            }

            options.dependencies[key].token = token;
        });

        decorator(target, propertyKey);
    };
}

export function Optional(): PropertyDecorator {
    return createDecorator((options, key) => {
        if (options.dependencies == null) {
            options.dependencies = {};
        }

        if (options.dependencies[key] == null) {
            options.dependencies[key] = {};
        }

        options.dependencies[key].optional = true;
    });
}

export class Injector {
    public static readonly THROW_IF_NOT_FOUND = new Object();

    public get parent(): Injector | null {
        return this._parent;
    }

    private readonly _parent: Injector | null;
    private readonly _tokenProviderMap = new Map<Token, Provider>();
    private readonly _tokenInstanceMap = new Map<Token, any>();

    constructor(providers: Provider[], parent?: Injector) {
        providers.forEach((provider) => {
            this._tokenProviderMap.set(
                typeof provider === "function" ? provider : provider.provide,
                provider
            );
        });

        this._parent = parent || null;
    }

    public get(token: Token, notFoundValue: any = Injector.THROW_IF_NOT_FOUND): any {
        if (this._tokenInstanceMap.has(token)) {
            return this._tokenInstanceMap.get(token);
        }

        if (this._tokenProviderMap.has(token)) {
            const provider = this._tokenProviderMap.get(token)!;
            const instance = this.resolveProviderInstance(provider);
            this._tokenInstanceMap.set(token, instance);
            return instance;
        }

        if (this.parent != null) {
            const instance = this.parent.get(token);
            this._tokenInstanceMap.set(token, instance);
            return instance;
        }

        if (notFoundValue === Injector.THROW_IF_NOT_FOUND) {
            throw new Error("Token is not found.");
        } else {
            return notFoundValue;
        }
    }

    private resolveProviderInstance(provider: Provider): any {
        if (typeof provider === "function") {
            return this.resolveTypeInstance(provider);
        } else if ("useValue" in provider) {
            return (provider as ValueProvider).useValue;
        } else if ("useClass" in provider) {
            return this.resolveTypeInstance((provider as ClassProvider).useClass);
        } else if ("useExisting" in provider) {
            return this.get((provider as ExistingProvider).useExisting);
        } else if ("useFactory" in provider) {
            const { useFactory, deps } = provider as FactoryProvider;
            return this.resolveFactoryInstance(useFactory, deps);
        }
    }

    private resolveTypeInstance(type: Type): any {
        const paramTypes: Type[] = Reflect.getMetadata("design:paramtypes", type) || [];

        const paramInstances: any[] = [];
        for (let i = 0; i < type.length; ++i) {
            // TODO: support `@Inject()` for constructor parameter.
            if (paramTypes[i] == null) {
                throw new Error("ParamTypes metadata is not found. Do you forget `@Injectable()`?");
            }

            const paramToken = paramTypes[i];
            const instance = this.get(paramToken);
            paramInstances.push(instance);
        }

        return new type(...paramInstances);
    }

    private resolveFactoryInstance(factory: Function, deps?: Object[]): any {
        if (deps == null) {
            deps = [];
        }

        const depInstances = deps.map((dep) => {
            if (dep == null) {
                throw new Error("Dependency token should not be `undefined` or `null`.");
            }
            return this.get(dep);
        });

        return factory(...depInstances);
    }
}

export default class VueTypeScriptInject {
    public static install(Vue: VueClass): void {
        Vue.mixin({
            beforeCreate(this: Vue & { [propertyKey: string]: any; }): void {
                const providers = this.$options.providers || [];
                const parentInjector = this.$parent != null ? this.$parent.$injector : undefined;
                (this as any).$injector = new Injector(providers, parentInjector);

                if (this.$options.dependencies != null) {
                    const dependencies = this.$options.dependencies;
                    Object.keys(dependencies).forEach((propertyKey) => {
                        const { token, optional } = dependencies[propertyKey];
                        this[propertyKey] = this.$injector.get(token!, optional ? null : Injector.THROW_IF_NOT_FOUND);
                    });
                }
            }
        });
    }
}
