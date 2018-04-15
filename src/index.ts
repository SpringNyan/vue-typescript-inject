import Vue, { VueConstructor } from "vue";

import { DependencyOptions } from "./declarations";
import { Injector } from "./injector";
import { Provider } from "./providers";

declare module "vue/types/vue" {
  export interface Vue {
    readonly $injector: Injector;
  }
}

declare module "vue/types/options" {
  export interface ComponentOptions<V extends Vue> {
    dependencies?: DependencyOptions;
    providers?: Provider[];
  }
}

export default class VueTypeScriptInject {
  public static install(_Vue: VueConstructor): void {
    _Vue.mixin({
      beforeCreate(this: Vue & { [propertyKey: string]: any }): void {
        const providers = this.$options.providers || [];
        const parent = this.$parent != null ? this.$parent.$injector : null;
        (this as any).$injector = new Injector(providers, parent);

        if (this.$options.dependencies != null) {
          const dependencies = this.$options.dependencies;
          Object.keys(dependencies).forEach(propertyKey => {
            this[propertyKey] = this.$injector.getByOption(
              dependencies[propertyKey]
            );
          });
        }
      }
    });
  }
}

export * from "./declarations";
export * from "./decorators";
export * from "./injector";
export * from "./providers";
export * from "./token";
