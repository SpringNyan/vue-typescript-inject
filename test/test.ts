import "reflect-metadata";

import { expect } from "chai";

import Vue from "vue";
import Component from "vue-class-component";

import VueTypeScriptInject, { Injectable, Inject } from "../dist/vue-typescript-inject";

describe("vue-typescript-inject", () => {
    Vue.use(VueTypeScriptInject);

    it("inject & provide", () => {
        class Service1 {
            public static count = 0;
            public id: number;

            constructor() {
                this.id = ++Service1.count;
            }
        }

        @Injectable()
        class Service2 {
            public static count = 0;
            public id: number;

            constructor() {
                this.id = ++Service2.count;
            }
        }

        @Injectable()
        class Service3 {
            public static count = 0;
            public id: number;

            constructor(public service1: Service1, public service2: Service2) {
                this.id = ++Service3.count;
            }
        }

        @Injectable()
        class Service4 {
            public static count = 0;
            public id: number;

            constructor(public service3: Service3, public service1: Service1, public service2: Service2) {
                this.id = ++Service4.count;
            }
        }

        @Component({
            providers: [
                Service2,
                Service4
            ]
        })
        class ChildComponent extends Vue {
            @Inject("key1") public key1: string;
            @Inject("key2") public key2: string;

            @Inject() public service1: Service1;
            @Inject() public service2: Service2;
            @Inject() public service3: Service3;
            @Inject() public service4: Service4;
        }

        @Component({
            components: {
                ChildComponent
            },
            providers: [
                { provide: "key1", useValue: "myKey1" },
                Service1,
                Service2,
                Service3,
                Service4
            ],
            template: `<div><ChildComponent></ChildComponent></div>`
        })
        class ParentComponent extends Vue {
            @Inject("key1") public key1: string;

            @Inject() public service1: Service1;
            @Inject() public service2: Service2;
            @Inject() public service3: Service3;
            @Inject() public service4: Service4;
        }

        const parentComponent = new ParentComponent();
        const service1Id = parentComponent.service1.id;
        const service2Id = parentComponent.service2.id;
        const service3Id = parentComponent.service3.id;
        const service4Id = parentComponent.service4.id;

        expect(parentComponent.key1).to.be.equal("myKey1");
        expect(parentComponent.service3.service1).to.be.equal(parentComponent.service1);
        expect(parentComponent.service3.service2).to.be.equal(parentComponent.service2);
        expect(parentComponent.service4.service1).to.be.equal(parentComponent.service1);
        expect(parentComponent.service4.service2).to.be.equal(parentComponent.service2);
        expect(parentComponent.service4.service3).to.be.equal(parentComponent.service3);

        /*
        const childComponent = parentComponent.$children[0] as ChildComponent;
        expect(childComponent.key1).to.be.equal("myKey1");
        expect(childComponent.key2).to.be.equal("myKey2");
        expect(childComponent.service1.id).to.be.equal(service1Id);
        expect(childComponent.service2.id).to.not.be.equal(service2Id);
        expect(childComponent.service3.id).to.be.equal(service3Id);
        expect(childComponent.service4.id).to.not.be.equal(service4Id);
        expect(childComponent.service4.service1).to.not.be.equal(parentComponent.service1);
        expect(childComponent.service4.service2).to.not.be.equal(childComponent.service2);
        expect(childComponent.service4.service3).to.not.be.equal(parentComponent.service3);
        */
    });
});
