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

    const serviceAInstance = new ServiceA();
    serviceAInstance.increase(); // 1
    serviceAInstance.increase(); // 2
    serviceAInstance.increase(); // 3

    @Component({
      render: Vue.compile(`
        <div>
          <span>{{ getNum() }}</span>
          <button @click="increase()">Increase</button>
        </div>
      `).render,
      providers: [
        {
          provide: ServiceA,
          useValue: serviceAInstance
        },
        ServiceB
      ]
    })
    class ComponentA extends Vue {
      @inject() private readonly _serviceA!: ServiceA;
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

    const wrapperA = mount(ComponentA);

    expect(wrapperA.vm.getNum()).to.equal(3);
    expect(wrapperA.vm.getStr()).to.equal("3");

    wrapperA.find("button").trigger("click");

    expect(wrapperA.vm.getNum()).to.equal(4);
    expect(wrapperA.vm.getStr()).to.equal("4");
  });
});
