import * as b from "bobril";

type Box<T> = {
    value: T
}

type CurrentValue<T> = T extends {} ? T : Box<T>

export type Ref<T> = { current: T | undefined };

export interface IHookRender<T, P extends any[]> {
    bobrilNode: Ref<b.IBobrilCacheNode>;
    element: Element;
    timesRerendered: () => number;
    currentValue: CurrentValue<T>;
    changeDependencies(...dependencies: P): void;
}

export function renderHook<T, P extends any[]>(hook: (...args: P) => T, ...dependencies: P): IHookRender<T, P> {
    return renderHookInsideParent(hook, null, ...dependencies);
}

export function renderHookInsideParent<T, P extends any[]>(hook: (...args: P) => T, Parent: b.IComponentFactory<any> | null,  ...dependencies: P): IHookRender<T, P> {
    let currentValue = {} as CurrentValue<T>;
    let deps = dependencies;
    let timesRerendered: number = 0;
    let cacheNode: Ref<b.IBobrilCacheNode> = { current: undefined };
    let domNode: HTMLDivElement;
    function Component() {
        const result = hook(...deps);
        Object.assign(currentValue, typeof result === "object" ? result : {value: result});
        timesRerendered++;
        return <div ref={cacheNode}>test{JSON.stringify(result)}</div>
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
