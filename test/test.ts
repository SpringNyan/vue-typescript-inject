import "jsdom-global/register";
import "reflect-metadata";

import { expect } from "chai";
import Vue from "vue";
import Component from "vue-class-component";
import { mount } from "@vue/test-utils";
import VueTypeScriptInject, {
  injectable,
  inject,
  optional,
  InjectionToken,
  Injector
} from "../lib";

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

    expect(wrapperA.vm.$injector.get<ServiceA>(ServiceA).num).to.equal(4);

    const serviceAToken = new InjectionToken<ServiceA>("serviceA");
    @injectable()
    class ServiceC {
      constructor(
        private readonly _service1: ServiceA,
        @inject(serviceAToken)
        @optional()
        private readonly _service2?: ServiceA
      ) {}

      public get num1(): number {
        return this._service1.num;
      }

      public get num2(): number {
        return this._service2 != null ? this._service2.num : -1;
      }
    }

    const injector = new Injector(
      [
        {
          provide: serviceAToken,
          useClass: ServiceA
        },
        ServiceC
      ],
      wrapperA.vm.$injector
    );
    injector.get(serviceAToken).increase();
    expect(injector.get(serviceAToken).num).to.equal(1);
    expect(injector.get<ServiceA>(ServiceA).num).to.equal(4);
    expect(injector.get<ServiceB>(ServiceB).str).to.equal("4");
    expect(injector.get<ServiceC>(ServiceC).num1).to.equal(4);
    expect(injector.get<ServiceC>(ServiceC).num2).to.equal(1);

    @Component({
      render: Vue.compile(`
        <div></div>
      `).render,
      providers: [ServiceC]
    })
    class ComponentB extends Vue {
      @inject() private readonly _serviceC!: ServiceC;

      public getNum1(): number {
        return this._serviceC.num1;
      }

      public getNum2(): number {
        return this._serviceC.num2;
      }
    }

    @Component({
      render: Vue.compile(`
      <div>
        <ComponentB></ComponentB>
      </div>
      `).render,
      components: { ComponentB },
      providers: [
        {
          provide: ServiceA,
          useValue: serviceAInstance
        }
      ]
    })
    class ComponentC extends Vue {}

    const wrapperC = mount(ComponentC);
    expect((wrapperC.vm.$children[0] as ComponentB).getNum1()).to.equal(4);
    expect((wrapperC.vm.$children[0] as ComponentB).getNum2()).to.equal(-1);
  });
});
