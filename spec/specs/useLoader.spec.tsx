import { afterEffect, clean, renderHook, rerender } from "../../src/index";
import { useLoader, useLoaderAsync } from "../test_hooks/useLoader";

interface Item {
    value: string;
}

describe("useLoader", () => {
    it("testing hook", () => {
        const container = renderHook(useLoader, {value: ""} as Item, () => ({ value: "loaded" }));

        expect(container.currentValue.value).toBe("");

        rerender();

        expect(container.currentValue.value).toBe("loaded");
    });

    it("testing hook with promise", async () => {
        const promise = new Promise<Item>(r => r({ value: "loaded async" }));
        const container = renderHook(useLoaderAsync, {value: ""} as Item, () => promise);

        expect(container.currentValue[0].value).toBe("");
        expect(container.currentValue[1]).toBeTruthy();

        await promise;
        await afterEffect();
        rerender();

        expect(container.currentValue[0].value).toBe("loaded async");
        expect(container.currentValue[1]).toBeFalsy();
    });

    afterEach(() => clean());
});