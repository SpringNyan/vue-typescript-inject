"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_class_component_1 = require("vue-class-component");
var injectableDecorator = function () { return undefined; };
function Injectable() {
    return injectableDecorator;
}
exports.Injectable = Injectable;
function Inject(token) {
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
        var decorator = vue_class_component_1.createDecorator(function (options, key) {
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
exports.Inject = Inject;
function Optional() {
    return function (target, propertyKey) {
        var decorator = vue_class_component_1.createDecorator(function (options, key) {
            if (options.dependencies == null) {
                options.dependencies = {};
            }
            if (options.dependencies[key] == null) {
                options.dependencies[key] = {};
            }
            options.dependencies[key].optional = true;
        });
        decorator(target, propertyKey);
    };
}
exports.Optional = Optional;
var Injector = /** @class */ (function () {
    function Injector(providers, parent) {
        var _this = this;
        this._tokenProviderMap = new Map();
        providers.forEach(function (provider) {
            _this._tokenProviderMap.set(typeof provider === "function" ? provider : provider.provide, provider);
        });
        this._parent = typeof parent === "function"
            ? parent
            : function () { return parent || null; };
    }
    Object.defineProperty(Injector.prototype, "parent", {
        get: function () {
            return this._parent();
        },
        enumerable: true,
        configurable: true
    });
    Injector.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = Injector.THROW_IF_NOT_FOUND; }
        if (this._tokenProviderMap.has(token)) {
            var provider = this._tokenProviderMap.get(token);
            var instance = this.resolveProviderInstance(provider);
            return instance;
        }
        if (this.parent != null) {
            var instance = this.parent.get(token);
            return instance;
        }
        if (notFoundValue === Injector.THROW_IF_NOT_FOUND) {
            throw new Error("Token is not found.");
        }
        else {
            return notFoundValue;
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
    Injector.THROW_IF_NOT_FOUND = new Object();
    return Injector;
}());
exports.Injector = Injector;
var VueTypeScriptInject = /** @class */ (function () {
    function VueTypeScriptInject() {
    }
    VueTypeScriptInject.install = function (Vue) {
        Vue.mixin({
            beforeCreate: function () {
                var _this = this;
                var providers = this.$options.providers || [];
                var parent = function () { return _this.$parent != null ? _this.$parent.$injector : null; };
                this.$injector = new Injector(providers, parent);
                if (this.$options.dependencies != null) {
                    var dependencies_1 = this.$options.dependencies;
                    Object.keys(dependencies_1).forEach(function (propertyKey) {
                        var _a = dependencies_1[propertyKey], token = _a.token, optional = _a.optional;
                        _this[propertyKey] = _this.$injector.get(token, optional ? null : Injector.THROW_IF_NOT_FOUND);
                    });
                }
            }
        });
    };
    return VueTypeScriptInject;
}());
exports.default = VueTypeScriptInject;
