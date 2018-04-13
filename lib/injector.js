import { typeFromMetadata, dependencyFromMetadata } from "./util";
var Injector = /** @class */ (function () {
    function Injector(providers, parent) {
        var _this = this;
        this._tokenProviderMap = new Map();
        this._tokenInstanceMap = new Map();
        providers.forEach(function (provider) {
            _this._tokenProviderMap.set(typeof provider === "function" ? provider : provider.provide, provider);
        });
        this.parent = parent || null;
    }
    Injector.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = Injector.THROW_IF_NOT_FOUND; }
        var value = this.getByOption({
            token: token,
            optional: notFoundValue !== Injector.THROW_IF_NOT_FOUND
        });
        return value === Injector.THROW_IF_NOT_FOUND ? notFoundValue : value;
    };
    Injector.prototype.getByOption = function (option) {
        var token = option.token, optional = option.optional;
        if (token == null) {
            throw new Error("Token should not be `undefined` or `null`");
        }
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
            return this.parent.get(token);
        }
        if (optional) {
            return Injector.THROW_IF_NOT_FOUND;
        }
        else {
            throw new Error("Provider is not found.");
        }
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
        var paramInstances = [];
        for (var i = 0; i < type.length; ++i) {
            var dependency = dependencyFromMetadata(type, i);
            if (dependency != null) {
                paramInstances.push(this.getByOption(dependency));
                continue;
            }
            var paramType = typeFromMetadata(type, "", i);
            if (paramType != null) {
                paramInstances.push(this.get(paramType));
                continue;
            }
            throw new Error("ParamTypes metadata is not found. Do you forget `@Injectable()`?");
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
    Injector.THROW_IF_NOT_FOUND = new Object();
    return Injector;
}());
export { Injector };
