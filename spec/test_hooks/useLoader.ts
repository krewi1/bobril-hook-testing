import * as b from "bobril";
import { is } from "bobril/src/localHelpers";


export function useLoader<T>(defaultValue: T, load: () => T): T {
    const [state, setState] = b.useState(defaultValue);
    b.useEffect(() => setState(load()), []);
    return state;
}

export function useLoaderAsync<T>(defaultValue: T, load: () => Promise<T>): [T, boolean] {
    const [state, setState] = b.useState(defaultValue);
    const [isLoading, setIsLoading] = b.useState(true);
    b.useEffect(() => void handleAsyncLoad(load, setState, setIsLoading), []);
    return [state, isLoading];
}

async function handleAsyncLoad<T>(load: () => Promise<T>, setState: (value: T | ((value: T) => T)) => void, setLoading: (value: boolean | ((value: boolean) => boolean)) => void): Promise<void> {
    await handleAsyncLoadInner(load, setState, setLoading);
    setLoading(false);
}
async function handleAsyncLoadInner<T>(load: () => Promise<T>, setState: (value: T | ((value: T) => T)) => void, setLoading: (value: boolean | ((value: boolean) => boolean)) => void): Promise<void> {
    setState(await load());
}