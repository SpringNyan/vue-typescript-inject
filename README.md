# vue-typescript-inject

[![npm](https://img.shields.io/npm/v/vue-typescript-inject.svg)](https://www.npmjs.com/package/vue-typescript-inject)

Angular-like injector for Vue

## Requirements

[TypeScript](https://github.com/Microsoft/TypeScript) with `--experimentalDecorators` and `--emitDecoratorMetadata` flags

[reflect-metadata](https://github.com/rbuckton/reflect-metadata)

[vue-class-component](https://github.com/vuejs/vue-class-component)

## Usage

```typescript
import "reflect-metadata";

import Vue from "vue";
import Component from "vue-class-component";
import VueTypeScriptInject, { injectable, inject } from "vue-typescript-inject";

Vue.use(VueTypeScriptInject); // register vue-typescript-inject

@injectable() // identify service class
class ServiceA {
  public num = 0;

  public increase() {
    this.num += 1;
  }
}

@injectable() // identify service class
class ServiceB {
  constructor(private readonly _serviceA: ServiceA) {} // will be auto injected

  public get str() {
    return "" + this._serviceA.num;
  }
}

@Component({
  template: `
    <div>
      <span>{{ getNum() }}</span>
      <button @click="increase()">Increase</button>
    </div>
  `,
  providers: [ServiceA, ServiceB] // register service providers
})
class ComponentA extends Vue {
  @inject() private readonly _serviceA!: ServiceA; // same as @inject(ServiceA)
  @inject(ServiceB) private readonly _serviceB!: ServiceB;

  public increase() {
    this._serviceA.increase();
  }

  public getNum() {
    return this._serviceA.num;
  }

  public getStr() {
    return this._serviceB.str;
  }
}
```

For more example, see [test/test.ts](https://github.com/SpringNyan/vue-typescript-inject/blob/master/test/test.ts)

For references, see [Angular Dependency Injection](https://angular.io/guide/dependency-injection)

## License

MIT
