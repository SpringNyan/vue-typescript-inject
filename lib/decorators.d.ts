import { Token } from "./declarations";
export declare function injectable(): ClassDecorator;
export declare function inject(token?: Token): ParameterDecorator;
export declare function optional(): ParameterDecorator;
