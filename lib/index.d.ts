import Vue, { VueConstructor } from "vue";
import { DependencyOptions } from "./declarations";
import { Injector } from "./injector";
import { Provider } from "./providers";
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
export default class VueTypeScriptInject {
    static install(_Vue: VueConstructor): void;
}
export * from "./declarations";
export * from "./decorators";
export * from "./injector";
export * from "./providers";
export * from "./token";
