import * as b from "bobril";

export const ThemeContext = b.createContext({
    color: "init color"
});

export function useThemeConsumer() {
    return b.useContext(ThemeContext);
}