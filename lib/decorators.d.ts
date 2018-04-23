import { Token } from "./declarations";
export declare function injectable(): ClassDecorator;
export declare function inject(token?: Token): PropertyDecorator & ParameterDecorator;
export declare function optional(): PropertyDecorator & ParameterDecorator;
