import * as b from "bobril";

type BoxedTypes = string | undefined | null | number | boolean | Function;

type Box<T> = {
    value: T
}

export type Ref<T> = { current: T | undefined };

export interface IHookRender<T, P extends any[]> {
    bobrilNode: Ref<b.IBobrilCacheNode>;
    element: Element;
    timesRerendered: () => number;
    currentValue: T extends BoxedTypes ? Box<T> : T;
    changeDependencies(...dependencies: P): void;
}


export function renderHook<T extends {}, P extends any[]>(hook: (...args: P) => T | void, ...dependencies: P): IHookRender<T, P> {
    return renderHookInsideParent(hook, null, ...dependencies);
}

export function renderHookInsideParent<T extends {}, P extends any[]>(
    hook: (...args: P) => T | void,
    Parent: b.IComponentFactory<any> | null,
    ...dependencies: P
): IHookRender<T, P> {
    let currentValue: T = {} as T;
    let deps = dependencies;
    let timesRerendered: number = 0;
    let cacheNode: Ref<b.IBobrilCacheNode> = { current: undefined };
    let domNode: HTMLDivElement;
    function Component() {
        const result = hook(...deps);
        Object.assign(
            currentValue,
            typeof result === "object" ? result : { value: result }
        );
        timesRerendered++;
        return <div ref={cacheNode}>test{JSON.stringify(result)}</div>;
    }

    b.init(() => {
        return Parent ? <Parent><Component/></Parent> : <Component/>;
    });
    b.syncUpdate();
    domNode = b.getDomNode(cacheNode.current) as HTMLDivElement;

    return {
        currentValue: currentValue as any,
        element: domNode,
        bobrilNode: cacheNode,
        timesRerendered: () => timesRerendered,
        changeDependencies(...dependencies: P) {
            deps = dependencies;
            rerender();
        }
    };
}

export function rerender() {
    b.invalidate();
    b.syncUpdate();
}

export function clean() {
    b.removeRoot("0");
}

export function afterEffect(): Promise<void> {
    return new Promise<void>((resolve) => b.asap(resolve));
}
