/// <reference types="reflect-metadata" />
import { createDecorator } from "vue-class-component";
var DEPENDENCIES_METADATA_KEY = "__dependencies__";
export function makeDecorator(handler) {
    return function (target, propertyKey, parameterIndex) {
        if (parameterIndex != null) {
            if (!Reflect.hasMetadata(DEPENDENCIES_METADATA_KEY, target)) {
                Reflect.defineMetadata(DEPENDENCIES_METADATA_KEY, [], target);
            }
            var dependencies = Reflect.getMetadata(DEPENDENCIES_METADATA_KEY, target);
            var dependency = dependencies[parameterIndex] || {};
            handler(dependency, target, propertyKey, parameterIndex);
            dependencies[parameterIndex] = dependency;
        }
        else {
            createDecorator(function (options, key) {
                if (options.dependencies == null) {
                    options.dependencies = {};
                }
                var dependency = options.dependencies[key] || {};
                handler(dependency, target, propertyKey, parameterIndex);
                options.dependencies[key] = dependency;
            })(target, propertyKey);
        }
    };
}
export function typeFromMetadata(target, propertyKey, parameterIndex) {
    if (parameterIndex != null) {
        var paramtypes = Reflect.getMetadata("design:paramtypes", target) || [];
        return paramtypes[parameterIndex] || null;
    }
    else {
        return Reflect.getMetadata("design:type", target, propertyKey) || null;
    }
}
export function dependencyFromMetadata(target, parameterIndex) {
    var dependencies = Reflect.getMetadata(DEPENDENCIES_METADATA_KEY, target) || [];
    return dependencies[parameterIndex] || null;
}
