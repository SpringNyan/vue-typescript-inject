/// <reference types="reflect-metadata" />

import Vue from "vue";
import { createDecorator } from "vue-class-component";
import { DependencyOption } from "./declarations";

const DEPENDENCIES_METADATA_KEY = "__dependencies__";

export function makeDecorator(
  handler: (
    dependency: DependencyOption,
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => void
): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    if (parameterIndex != null) {
      if (!Reflect.hasMetadata(DEPENDENCIES_METADATA_KEY, target)) {
        Reflect.defineMetadata(DEPENDENCIES_METADATA_KEY, [], target);
      }

      const dependencies: DependencyOption[] = Reflect.getMetadata(
        DEPENDENCIES_METADATA_KEY,
        target
      );

      const dependency = dependencies[parameterIndex] || {};
      handler(dependency, target, propertyKey, parameterIndex);
      dependencies[parameterIndex] = dependency;
    } else {
      createDecorator((options, key) => {
        if (options.dependencies == null) {
          options.dependencies = {};
        }

        const dependency = options.dependencies[key] || {};
        handler(dependency, target, propertyKey, parameterIndex);
        options.dependencies[key] = dependency;
      })(target as Vue, propertyKey as string);
    }
  };
}

export function typeFromMetadata(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
): Object | null {
  if (parameterIndex != null) {
    const paramtypes = Reflect.getMetadata("design:paramtypes", target) || [];
    return paramtypes[parameterIndex] || null;
  } else {
    return Reflect.getMetadata("design:type", target, propertyKey) || null;
  }
}

export function dependencyFromMetadata(
  target: Object,
  parameterIndex: number
): DependencyOption | null {
  const dependencies =
    Reflect.getMetadata(DEPENDENCIES_METADATA_KEY, target) || [];

  return dependencies[parameterIndex] || null;
}
