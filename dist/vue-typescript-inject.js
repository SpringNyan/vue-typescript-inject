var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import "reflect-metadata";
import { createDecorator } from "vue-class-component";
var injectableDecorator = function () { return; };
export function Injectable() {
    return injectableDecorator;
}
export function Inject(token) {
    return function (target, propertyKey) {
        if (token === undefined) {
            token = Reflect.getMetadata("design:type", target, propertyKey);
            if (token == null) {
                throw new Error("Type metadata is not found.");
            }
        }
        if (token === null) {
            throw new Error("Token should not be `null`.");
        }
        var decorator = createDecorator(function (options, key) {
            if (options.dependencies == null) {
                options.dependencies = {};
            }
            options.dependencies[key] = token;
        });
        decorator(target, propertyKey);
    };
}
var TokenNotFoundError = (function (_super) {
    __extends(TokenNotFoundError, _super);
    function TokenNotFoundError(message) {
        var _this = _super.call(this, message) || this;
        if (message == null) {
            _this.message = "Token not found.";
        }
        return _this;
    }
    return TokenNotFoundError;
}(Error));
export { TokenNotFoundError };
var Injector = (function () {
    function Injector(providers, parent) {
        var _this = this;
        this._tokenProviderMap = new Map();
        this._tokenInstanceMap = new Map();
        providers.forEach(function (provider) {
            _this._tokenProviderMap.set(typeof provider === "function" ? provider : provider.provide, provider);
        });
        this._parent = parent || null;
    }
    Object.defineProperty(Injector.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Injector.prototype.get = function (token) {
        if (this._tokenInstanceMap.has(token)) {
            return this._tokenInstanceMap.get(token);
        }
        if (this._tokenProviderMap.has(token)) {
            var provider = this._tokenProviderMap.get(token);
            var instance = this.resolveProviderInstance(provider);
            this._tokenInstanceMap.set(token, instance);
            return instance;
        }
        if (this.parent != null) {
            var instance = this.parent.get(token);
            this._tokenInstanceMap.set(token, instance);
            return instance;
        }
        throw new TokenNotFoundError();
    };
    Injector.prototype.resolveProviderInstance = function (provider) {
        if (typeof provider === "function") {
            return this.resolveTypeInstance(provider);
        }
        else if ("useValue" in provider) {
            return provider.useValue;
        }
        else if ("useClass" in provider) {
            return this.resolveTypeInstance(provider.useClass);
        }
        else if ("useExisting" in provider) {
            return this.get(provider.useExisting);
        }
        else if ("useFactory" in provider) {
            var _a = provider, useFactory = _a.useFactory, deps = _a.deps;
            return this.resolveFactoryInstance(useFactory, deps);
        }
    };
    Injector.prototype.resolveTypeInstance = function (type) {
        var paramTypes = Reflect.getMetadata("design:paramtypes", type) || [];
        var paramInstances = [];
        for (var i = 0; i < type.length; ++i) {
            // TODO: support `@Inject()` for constructor parameter.
            if (paramTypes[i] == null) {
                throw new Error("ParamTypes metadata is not found. Do you forget `@Injectable()`?");
            }
            var paramToken = paramTypes[i];
            var instance = this.get(paramToken);
            paramInstances.push(instance);
        }
        return new (type.bind.apply(type, [void 0].concat(paramInstances)))();
    };
    Injector.prototype.resolveFactoryInstance = function (factory, deps) {
        var _this = this;
        if (deps == null) {
            deps = [];
        }
        var depInstances = deps.map(function (dep) {
            if (dep == null) {
                throw new Error("Dependency token should not be `undefined` or `null`.");
            }
            return _this.get(dep);
        });
        return factory.apply(void 0, depInstances);
    };
    return Injector;
}());
export { Injector };
var VueTypeScriptInject = (function () {
    function VueTypeScriptInject() {
    }
    // tslint:disable-next-line:no-shadowed-variable
    VueTypeScriptInject.install = function (Vue) {
        Vue.mixin({
            beforeCreate: function () {
                var _this = this;
                var providers = this.$options.providers || [];
                var parent = this.$parent != null ? this.$parent.$injector : undefined;
                this.$injector = new Injector(providers, parent);
                if (this.$options.dependencies != null) {
                    var dependencies_1 = this.$options.dependencies;
                    Object.keys(dependencies_1).forEach(function (propertyKey) {
                        _this[propertyKey] = _this.$injector.get(dependencies_1[propertyKey]);
                    });
                }
            }
        });
    };
    return VueTypeScriptInject;
}());
export default VueTypeScriptInject;
