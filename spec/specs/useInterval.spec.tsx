import { clean, renderHook } from "../../src/index";
import { useInterval } from "../test_hooks/useInterval";

describe("useInterval", () => {
    let clock: jasmine.Clock;
    beforeEach(() => {
        clock = jasmine.clock();
        clock.install();
    });
    it("call callback after timeout", async () => {
        const spy = jasmine.createSpy("testFunction");
        renderHook(useInterval, spy, 500);
        clock.tick(501);
        expect(spy).toHaveBeenCalled();
    });

    it("call correct callback when changed", async () => {
        const spy = jasmine.createSpy("testFunction");
        const container = renderHook(useInterval, spy, 500);

        const spyTwo = jasmine.createSpy("testFunction2");
        container.changeDependencies(spyTwo, 500);

        clock.tick(501);
        expect(spy).not.toHaveBeenCalled();
        expect(spyTwo).toHaveBeenCalled();
    });

    it("change time", async () => {
        const spy = jasmine.createSpy("testFunction");
        const container = renderHook(useInterval, spy, 500);

        clock.tick(499);
        expect(spy).not.toHaveBeenCalled();
        container.changeDependencies(spy, 300);

        clock.tick(200);
        expect(spy).not.toHaveBeenCalled();

        clock.tick(101);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        clock.uninstall();
        clean();
    });
});