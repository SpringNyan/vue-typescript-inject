import { makeDecorator, typeFromMetadata } from "./util";
var injectableDecorator = function (target) { return target; };
export function injectable() {
    return injectableDecorator;
}
export function inject(token) {
    return makeDecorator(function (dependency, target, propertyKey, parameterIndex) {
        if (token == null) {
            var type = typeFromMetadata(target, propertyKey, parameterIndex);
            if (type == null) {
                throw new Error("Type metadata is not found.");
            }
            token = type;
        }
        dependency.token = token;
    });
}
export function optional() {
    return makeDecorator(function (dependency, target, propertyKey, parameterIndex) {
        dependency.optional = true;
    });
}
