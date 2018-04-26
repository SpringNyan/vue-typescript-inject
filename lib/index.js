import { Injector } from "./injector";
var VueTypeScriptInject = /** @class */ (function () {
    function VueTypeScriptInject() {
    }
    VueTypeScriptInject.install = function (_Vue) {
        _Vue.mixin({
            beforeCreate: function () {
                var _this = this;
                var providers = this.$options.providers || [];
                var parent = this.$parent != null ? this.$parent.$injector : null;
                this.$injector = new Injector(providers, parent);
                if (this.$options.dependencies != null) {
                    var dependencies_1 = this.$options.dependencies;
                    Object.keys(dependencies_1).forEach(function (propertyKey) {
                        _this[propertyKey] = _this.$injector.getByOption(dependencies_1[propertyKey]);
                    });
                }
            }
        });
    };
    return VueTypeScriptInject;
}());
export default VueTypeScriptInject;
export * from "./decorators";
export * from "./injector";
export * from "./token";
