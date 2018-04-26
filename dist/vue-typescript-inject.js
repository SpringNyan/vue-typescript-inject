(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue-class-component"));
	else if(typeof define === 'function' && define.amd)
		define(["vue-class-component"], factory);
	else if(typeof exports === 'object')
		exports["vue-typescript-inject"] = factory(require("vue-class-component"));
	else
		root["vue-typescript-inject"] = factory(root["vue-class-component"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_vue_class_component__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/decorators.js":
/*!***************************!*\
  !*** ./lib/decorators.js ***!
  \***************************/
/*! exports provided: injectable, inject, optional */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"injectable\", function() { return injectable; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"inject\", function() { return inject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"optional\", function() { return optional; });\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ \"./lib/util.js\");\n\r\nvar injectableDecorator = function (target) { return target; };\r\nfunction injectable() {\r\n    return injectableDecorator;\r\n}\r\nfunction inject(token) {\r\n    return Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"makeDecorator\"])(function (dependency, target, propertyKey, parameterIndex) {\r\n        if (token == null) {\r\n            var type = Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"typeFromMetadata\"])(target, propertyKey, parameterIndex);\r\n            if (type == null) {\r\n                throw new Error(\"Type metadata is not found.\");\r\n            }\r\n            token = type;\r\n        }\r\n        dependency.token = token;\r\n    });\r\n}\r\nfunction optional() {\r\n    return Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"makeDecorator\"])(function (dependency, target, propertyKey, parameterIndex) {\r\n        dependency.optional = true;\r\n        dependency.notFoundValue = null;\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack://vue-typescript-inject/./lib/decorators.js?");

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! exports provided: default, injectable, inject, optional, Injector, InjectionToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _injector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./injector */ \"./lib/injector.js\");\n/* harmony import */ var _decorators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./decorators */ \"./lib/decorators.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"injectable\", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__[\"injectable\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"inject\", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__[\"inject\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"optional\", function() { return _decorators__WEBPACK_IMPORTED_MODULE_1__[\"optional\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Injector\", function() { return _injector__WEBPACK_IMPORTED_MODULE_0__[\"Injector\"]; });\n\n/* harmony import */ var _token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./token */ \"./lib/token.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"InjectionToken\", function() { return _token__WEBPACK_IMPORTED_MODULE_2__[\"InjectionToken\"]; });\n\n\r\nvar VueTypeScriptInject = /** @class */ (function () {\r\n    function VueTypeScriptInject() {\r\n    }\r\n    VueTypeScriptInject.install = function (_Vue) {\r\n        _Vue.mixin({\r\n            beforeCreate: function () {\r\n                var _this = this;\r\n                var providers = this.$options.providers || [];\r\n                var parent = this.$parent != null ? this.$parent.$injector : null;\r\n                this.$injector = new _injector__WEBPACK_IMPORTED_MODULE_0__[\"Injector\"](providers, parent);\r\n                if (this.$options.dependencies != null) {\r\n                    var dependencies_1 = this.$options.dependencies;\r\n                    Object.keys(dependencies_1).forEach(function (propertyKey) {\r\n                        _this[propertyKey] = _this.$injector.getByOption(dependencies_1[propertyKey]);\r\n                    });\r\n                }\r\n            }\r\n        });\r\n    };\r\n    return VueTypeScriptInject;\r\n}());\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (VueTypeScriptInject);\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://vue-typescript-inject/./lib/index.js?");

/***/ }),

/***/ "./lib/injector.js":
/*!*************************!*\
  !*** ./lib/injector.js ***!
  \*************************/
/*! exports provided: Injector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Injector\", function() { return Injector; });\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ \"./lib/util.js\");\n\r\nvar Injector = /** @class */ (function () {\r\n    function Injector(providers, parent) {\r\n        var _this = this;\r\n        this._tokenProviderMap = new Map();\r\n        this._tokenInstanceMap = new Map();\r\n        providers.forEach(function (provider) {\r\n            _this._tokenProviderMap.set(typeof provider === \"function\" ? provider : provider.provide, provider);\r\n        });\r\n        this.parent = parent || null;\r\n    }\r\n    Injector.prototype.get = function (token, notFoundValue) {\r\n        if (notFoundValue === void 0) { notFoundValue = Injector.THROW_IF_NOT_FOUND; }\r\n        return this.getByOption({\r\n            token: token,\r\n            optional: notFoundValue !== Injector.THROW_IF_NOT_FOUND,\r\n            notFoundValue: notFoundValue\r\n        });\r\n    };\r\n    Injector.prototype.getByOption = function (option) {\r\n        var token = option.token, optional = option.optional, notFoundValue = option.notFoundValue;\r\n        if (token == null) {\r\n            throw new Error(\"Token should not be `undefined` or `null`\");\r\n        }\r\n        if (this._tokenInstanceMap.has(token)) {\r\n            return this._tokenInstanceMap.get(token);\r\n        }\r\n        if (this._tokenProviderMap.has(token)) {\r\n            var provider = this._tokenProviderMap.get(token);\r\n            var instance = this.resolveProviderInstance(provider);\r\n            this._tokenInstanceMap.set(token, instance);\r\n            return instance;\r\n        }\r\n        if (this.parent != null) {\r\n            return this.parent.getByOption(option);\r\n        }\r\n        if (optional) {\r\n            return notFoundValue;\r\n        }\r\n        else {\r\n            throw new Error(\"Provider is not found.\");\r\n        }\r\n    };\r\n    Injector.prototype.resolveProviderInstance = function (provider) {\r\n        if (typeof provider === \"function\") {\r\n            return this.resolveTypeInstance(provider);\r\n        }\r\n        else if (\"useValue\" in provider) {\r\n            return provider.useValue;\r\n        }\r\n        else if (\"useClass\" in provider) {\r\n            return this.resolveTypeInstance(provider.useClass);\r\n        }\r\n        else if (\"useExisting\" in provider) {\r\n            return this.get(provider.useExisting);\r\n        }\r\n        else if (\"useFactory\" in provider) {\r\n            var _a = provider, useFactory = _a.useFactory, deps = _a.deps;\r\n            return this.resolveFactoryInstance(useFactory, deps);\r\n        }\r\n    };\r\n    Injector.prototype.resolveTypeInstance = function (type) {\r\n        var paramInstances = [];\r\n        for (var i = 0; i < type.length; ++i) {\r\n            var dependency = Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"dependencyFromMetadata\"])(type, i);\r\n            if (dependency != null) {\r\n                paramInstances.push(this.getByOption(dependency));\r\n                continue;\r\n            }\r\n            var paramType = Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"typeFromMetadata\"])(type, \"\", i);\r\n            if (paramType != null) {\r\n                paramInstances.push(this.get(paramType));\r\n                continue;\r\n            }\r\n            throw new Error(\"ParamTypes metadata is not found. Do you forget `@Injectable()`?\");\r\n        }\r\n        return new (type.bind.apply(type, [void 0].concat(paramInstances)))();\r\n    };\r\n    Injector.prototype.resolveFactoryInstance = function (factory, deps) {\r\n        var _this = this;\r\n        if (deps == null) {\r\n            deps = [];\r\n        }\r\n        var depInstances = deps.map(function (dep) {\r\n            if (dep == null) {\r\n                throw new Error(\"Dependency token should not be `undefined` or `null`.\");\r\n            }\r\n            return _this.get(dep);\r\n        });\r\n        return factory.apply(void 0, depInstances);\r\n    };\r\n    Injector.THROW_IF_NOT_FOUND = new Object();\r\n    return Injector;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://vue-typescript-inject/./lib/injector.js?");

/***/ }),

/***/ "./lib/token.js":
/*!**********************!*\
  !*** ./lib/token.js ***!
  \**********************/
/*! exports provided: InjectionToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"InjectionToken\", function() { return InjectionToken; });\nvar InjectionToken = /** @class */ (function () {\r\n    function InjectionToken(desc) {\r\n        this._desc = desc;\r\n    }\r\n    InjectionToken.prototype.toString = function () {\r\n        return \"InjectionToken \" + (this._desc != null ? this._desc : \"?\");\r\n    };\r\n    return InjectionToken;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://vue-typescript-inject/./lib/token.js?");

/***/ }),

/***/ "./lib/util.js":
/*!*********************!*\
  !*** ./lib/util.js ***!
  \*********************/
/*! exports provided: makeDecorator, typeFromMetadata, dependencyFromMetadata */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"makeDecorator\", function() { return makeDecorator; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"typeFromMetadata\", function() { return typeFromMetadata; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"dependencyFromMetadata\", function() { return dependencyFromMetadata; });\n/* harmony import */ var vue_class_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-class-component */ \"vue-class-component\");\n/* harmony import */ var vue_class_component__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue_class_component__WEBPACK_IMPORTED_MODULE_0__);\n/// <reference types=\"reflect-metadata\" />\r\n\r\nvar DEPENDENCIES_METADATA_KEY = \"__dependencies__\";\r\nfunction makeDecorator(handler) {\r\n    return function (target, propertyKey, parameterIndex) {\r\n        if (parameterIndex != null) {\r\n            if (!Reflect.hasMetadata(DEPENDENCIES_METADATA_KEY, target)) {\r\n                Reflect.defineMetadata(DEPENDENCIES_METADATA_KEY, [], target);\r\n            }\r\n            var dependencies = Reflect.getMetadata(DEPENDENCIES_METADATA_KEY, target);\r\n            var dependency = dependencies[parameterIndex] || {};\r\n            handler(dependency, target, propertyKey, parameterIndex);\r\n            dependencies[parameterIndex] = dependency;\r\n        }\r\n        else {\r\n            Object(vue_class_component__WEBPACK_IMPORTED_MODULE_0__[\"createDecorator\"])(function (options, key) {\r\n                if (options.dependencies == null) {\r\n                    options.dependencies = {};\r\n                }\r\n                var dependency = options.dependencies[key] || {};\r\n                handler(dependency, target, propertyKey, parameterIndex);\r\n                options.dependencies[key] = dependency;\r\n            })(target, propertyKey);\r\n        }\r\n    };\r\n}\r\nfunction typeFromMetadata(target, propertyKey, parameterIndex) {\r\n    if (parameterIndex != null) {\r\n        var paramtypes = Reflect.getMetadata(\"design:paramtypes\", target) || [];\r\n        return paramtypes[parameterIndex] || null;\r\n    }\r\n    else {\r\n        return Reflect.getMetadata(\"design:type\", target, propertyKey) || null;\r\n    }\r\n}\r\nfunction dependencyFromMetadata(target, parameterIndex) {\r\n    var dependencies = Reflect.getMetadata(DEPENDENCIES_METADATA_KEY, target) || [];\r\n    return dependencies[parameterIndex] || null;\r\n}\r\n\n\n//# sourceURL=webpack://vue-typescript-inject/./lib/util.js?");

/***/ }),

/***/ "vue-class-component":
/*!**************************************!*\
  !*** external "vue-class-component" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_vue_class_component__;\n\n//# sourceURL=webpack://vue-typescript-inject/external_%22vue-class-component%22?");

/***/ })

/******/ });
});