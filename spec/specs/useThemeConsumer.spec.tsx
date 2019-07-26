import * as b from "bobril";
import { renderHook, renderHookInsideParent } from "../../src/index";
import { ThemeContext, useThemeConsumer } from "../test_hooks/useThemeConsumer";

describe("with context", () => {
    it("use theme without provider", () => {
        const container = renderHook(useThemeConsumer);

        expect(container.currentValue.color).toBe("init color");
    });

    it("use theme with provider", () => {
        function Provider({children}: {children: b.IBobrilNode}) {
            b.useProvideContext(ThemeContext, {
                color: "blue"
            });
            return <>{children}</>;
        }

        const container = renderHookInsideParent(useThemeConsumer, Provider);
        expect(container.currentValue.color).toBe("blue");
    });
});