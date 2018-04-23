import "jsdom-global/register";
import "reflect-metadata";

import { expect } from "chai";
import Vue from "vue";
import Component from "vue-class-component";
import { mount } from "@vue/test-utils";
import VueTypeScriptInject, { injectable, inject } from "../lib";

Vue.use(VueTypeScriptInject);

describe("vue-typescript-inject", () => {
  it("test", () => {
    @injectable()
    class ServiceA {
      public get num() {
        return this._num;
      }

      private _num = 0;

      public increase() {
        this._num += 1;
      }
    }

    @injectable()
    class ServiceB {
      constructor(private readonly _serviceA: ServiceA) {}

      public get str() {
        return "" + this._serviceA.num;
      }
    }

    @Component({
      template: `
        <div>
          <span>{{ num }}</span>
          <button @click="increase()">Increment</button>
        </div>
      `,
      providers: [ServiceA, ServiceB]
    })
    class ComponentA extends Vue {
      @inject() private readonly _serviceA!: ServiceA;
      @inject(ServiceB) private readonly _serviceB!: ServiceB;

      public get num() {
        return this._serviceA.num;
      }

      public increase() {
        this._serviceA.increase();
      }

      public getStr() {
        return this._serviceB.str;
      }
    }

    const wrapperA = mount(ComponentA);

    expect(wrapperA.vm.num).to.equal(0);
    wrapperA.find("button").trigger("click");
    expect(wrapperA.vm.num).to.equal(1);
    expect(wrapperA.vm.getStr()).to.equal("1");
  });
});
