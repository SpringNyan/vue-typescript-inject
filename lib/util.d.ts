import { DependencyOption } from "./declarations";
export declare function makeDecorator(handler: (dependency: DependencyOption, target: Object, propertyKey: string | symbol, parameterIndex: number | undefined) => void): PropertyDecorator & ParameterDecorator;
export declare function typeFromMetadata(target: Object, propertyKey: string | symbol, parameterIndex: number | undefined): Object | null;
export declare function dependencyFromMetadata(target: Object, parameterIndex: number): DependencyOption | null;
