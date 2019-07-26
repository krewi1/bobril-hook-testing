import * as b from "bobril";

export interface IHookRender<T, P extends any[]> {
    bobrilNode: {current: b.IBobrilCacheNode};
    element: Element;
    currentValue: T
    changeDependencies(...dependencies: P): void;
}


export function renderHook<T, P extends any[]>(hook: (...args: P) => T, ...dependencies: P): IHookRender<T, P> {
    return renderHookInsideParent(hook, null, ...dependencies);
}

export function renderHookInsideParent<T, P extends any[]>(hook: (...args: P) => T, Parent: b.IComponentFactory<any> | null,  ...dependencies: P) {
    let currentValue: T = {} as T;
    let deps = dependencies;
    let cacheNode: {current: b.IBobrilCacheNode} = {current: null};
    let domNode: HTMLDivElement;
    function Component() {
        Object.assign(currentValue, hook(...deps));
        return <div ref={cacheNode}>test</div>
    }

    b.init(() => {
        return Parent ? <Parent><Component/></Parent> : <Component/>;
    });
    b.syncUpdate();
    domNode = b.getDomNode(cacheNode.current) as HTMLDivElement;

    return {
        currentValue,
        element: domNode,
        bobrilNode: cacheNode,
        changeDependencies(...dependencies: P) {
            deps = dependencies;
            rerender();
        }
    }
}

export function afterEffect() {
    return new Promise(resolve => b.asap(resolve));
}

export function rerender() {
    b.invalidate();
    b.syncUpdate();
}

export function clean() {
    b.removeRoot("0");
}