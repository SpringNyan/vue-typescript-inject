import { DependencyOption } from "./declarations";
export declare function makeDecorator(handler: (dependency: DependencyOption, target: Object, propertyKey: string | symbol, parameterIndex: number) => void): ParameterDecorator;
export declare function typeFromMetadata(target: Object, propertyKey: string | symbol, parameterIndex: number): Object | null;
export declare function dependencyFromMetadata(target: Object, parameterIndex: number): DependencyOption | null;
