import "reflect-metadata";

import Vue from "vue";
import { createDecorator } from "vue-class-component";

declare module "vue/types/vue" {
    // tslint:disable-next-line:no-shadowed-variable
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

export type Type<T extends Object = Object> = new (...args: any[]) => T;

export type Dependencies = { [propertyKey: string]: Object };

export type Provider = TypeProvider | ValueProvider | ClassProvider | ExistingProvider | FactoryProvider;
export type TypeProvider = Type;
export type ValueProvider = { provide: Object; useValue: any; };
export type ClassProvider = { provide: Object; useClass: Type; };
export type ExistingProvider = { provide: Object; useExisting: Object; };
export type FactoryProvider = { provide: Object; useFactory: Function; deps?: Object[]; };

const injectableDecorator = () => { return; };
export function Injectable(): ClassDecorator {
    return injectableDecorator;
}

export function Inject(token?: Object): PropertyDecorator {
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

            options.dependencies[key] = token!;
        });

        decorator(target, propertyKey);
    };
}

export class TokenNotFoundError extends Error {
    constructor(message?: string) {
        super(message);

        if (message == null) {
            this.message = "Token not found.";
        }
    }
}

export class Injector {
    public get parent(): Injector | null {
        return this._parent;
    }

    private readonly _parent: Injector | null;
    private readonly _tokenProviderMap = new Map<Object, Provider>();
    private readonly _tokenInstanceMap = new Map<Object, any>();

    constructor(providers: Provider[], parent?: Injector) {
        providers.forEach((provider) => {
            this._tokenProviderMap.set(
                typeof provider === "function" ? provider : provider.provide,
                provider
            );
        });

        this._parent = parent || null;
    }

    public get(token: Object): any {
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

        throw new TokenNotFoundError();
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
    // tslint:disable-next-line:no-shadowed-variable
    public static install(Vue: VueClass): void {
        Vue.mixin({
            beforeCreate(this: Vue & { [propertyKey: string]: any; }): void {
                const providers = this.$options.providers || [];
                const parent = this.$parent != null ? this.$parent.$injector : undefined;
                (this as any).$injector = new Injector(providers, parent);

                if (this.$options.dependencies != null) {
                    const dependencies = this.$options.dependencies;
                    Object.keys(dependencies).forEach((propertyKey) => {
                        this[propertyKey] = this.$injector.get(dependencies[propertyKey]);
                    });
                }
            }
        });
    }
}
