import { Token } from "./declarations";
import { makeDecorator, typeFromMetadata } from "./util";

const injectableDecorator: ClassDecorator = (target) => target;
export function injectable(): ClassDecorator {
  return injectableDecorator;
}

export function inject(token?: Token): PropertyDecorator | ParameterDecorator {
  return makeDecorator((dependency, target, propertyKey, parameterIndex) => {
    if (token == null) {
      const type = typeFromMetadata(target, propertyKey, parameterIndex);
      if (type == null) {
        throw new Error("Type metadata is not found.");
      }

      token = type;
    }

    dependency.token = token;
  });
}

export function optional(): PropertyDecorator | ParameterDecorator {
  return makeDecorator((dependency, target, propertyKey, parameterIndex) => {
    dependency.optional = true;
  });
}
