import { clean, renderHook } from "../../src/index";
import { useCounter } from "../test_hooks/useCounter";

describe("useCounter", () => {
    it("testing hook", () => {
        const container = renderHook(useCounter);

        expect(container.currentValue.count).toBe(0);

        container.currentValue.increment();
        expect(container.currentValue.count).toBe(1);
    });

    it("with params", () => {
        const container = renderHook(useCounter, 6);

        expect(container.currentValue.count).toBe(6);
        container.currentValue.increment();
        expect(container.currentValue.count).toBe(7);
    });

    afterEach(() => clean());
});