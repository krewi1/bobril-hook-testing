import * as b from "bobril/index";
import { clean, Ref, renderHook } from "../../src";
import { useMeter } from "../test_hooks/useDomMeasure";

describe("domMeter", () => {
    it("can measure dom", () => {
        const measureContainer = {
            bottom: 8,
            left: 4,
            right: 6,
            top: 2,
            width: 2,
            height: 6
        };
        const container = renderHook(useMeter, { current: undefined } as Ref<b.IBobrilCacheNode>);
        spyOn(container.element, "getBoundingClientRect").and.returnValue(measureContainer);
        container.changeDependencies(container.bobrilNode);
        expect(container.currentValue.bottom).toBe(8);
        expect(container.currentValue.left).toBe(4);
        expect(container.currentValue.right).toBe(6);
        expect(container.currentValue.top).toBe(2);
        expect(container.currentValue.width).toBe(2);
        expect(container.currentValue.height).toBe(6);
    });

    afterEach(() => clean());
});