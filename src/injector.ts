import { Token, Type, DependencyOption } from "./declarations";
import {
  Provider,
  TypeProvider,
  ValueProvider,
  ClassProvider,
  ExistingProvider,
  FactoryProvider
} from "./providers";
import { InjectionToken } from "./token";
import { typeFromMetadata, dependencyFromMetadata } from "./util";

export class Injector {
  public static readonly THROW_IF_NOT_FOUND = new Object();

  public readonly parent: Injector | null;
  private readonly _tokenProviderMap = new Map<Token, Provider>();
  private readonly _tokenInstanceMap = new Map<Token, any>();

  constructor(providers: Provider[], parent?: Injector | null) {
    providers.forEach((provider) => {
      this._tokenProviderMap.set(
        typeof provider === "function" ? provider : provider.provide,
        provider
      );
    });

    this.parent = parent || null;
  }

  public get<T>(token: InjectionToken<T>, notFoundValue?: T): T;
  public get<T = any>(token: Token, notFoundValue?: T): T;
  public get(
    token: Token,
    notFoundValue: any = Injector.THROW_IF_NOT_FOUND
  ): any {
    return this.getByOption({
      token,
      optional: notFoundValue !== Injector.THROW_IF_NOT_FOUND,
      notFoundValue
    });
  }

  public getByOption(option: DependencyOption): any {
    const { token, optional, notFoundValue } = option;
    if (token == null) {
      throw new Error("Token should not be `undefined` or `null`");
    }

    if (this._tokenInstanceMap.has(token)) {
      return this._tokenInstanceMap.get(token);
    }

    if (this._tokenProviderMap.has(token)) {
      const provider = this._tokenProviderMap.get(token)!;
      const instance = this.resolveProviderInstance(provider);
      this._tokenInstanceMap.set(token, instance);
      return instance;
    }

    if (token === Injector) {
      return this;
    }

    if (this.parent != null) {
      return this.parent.getByOption(option);
    }

    if (optional) {
      return notFoundValue;
    } else {
      throw new Error("Provider is not found.");
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
    const paramInstances: any[] = [];
    for (let i = 0; i < type.length; ++i) {
      const dependency = dependencyFromMetadata(type, i);
      if (dependency != null) {
        paramInstances.push(this.getByOption(dependency));
        continue;
      }

      const paramType = typeFromMetadata(type, "", i);
      if (paramType != null) {
        paramInstances.push(this.get(paramType));
        continue;
      }

      throw new Error(
        `ParamTypes metadata is not found. Do you forget \`@injectable()\` for class ${type.name}?`
      );
    }

    return new type(...paramInstances);
  }

  private resolveFactoryInstance(factory: Function, deps?: Token[]): any {
    if (deps == null) {
      deps = [];
    }

    const depInstances = deps.map((dep) => {
      if (dep == null) {
        throw new Error(
          "Dependency token should not be `undefined` or `null`."
        );
      }
      return this.get(dep);
    });

    return factory(...depInstances);
  }
}
