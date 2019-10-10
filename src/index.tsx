import * as b from "bobril";

export function renderHook<T, P extends any[]>(hook: (...args: P) => T, ...dependencies: P): HookRenderer<T, P> {
    return new HookRenderer(hook, null, ...dependencies);
}

export function renderHookInsideParent<T, P extends any[]>(hook: (...args: P) => T, Parent: b.IComponentFactory<any>, ...dependencies: P): HookRenderer<T, P> {
    return new HookRenderer(hook, Parent, ...dependencies);
}

export class HookRenderer<T, P extends any[]> {
    private readonly _currentValue: T = {} as T;
    private _dependencies: P;
    private readonly _bobrilNode : {current: b.IBobrilCacheNode};
    private readonly _domNode: HTMLDivElement;

    constructor(hook: (...args: P) => T, Parent: b.IComponentFactory<any> | null, ...dependencies: P) {
        this._dependencies = dependencies;
        this._bobrilNode = {current: null};
        this._currentValue = {} as T;

        const Component = () => {
            Object.assign(this._currentValue, hook(...this._dependencies));
            return <div ref={this._bobrilNode}>test</div>
        };

        b.init(() => {
            return Parent ? <Parent><Component/></Parent> : <Component/>;
        });
        b.syncUpdate();
        this._domNode = b.getDomNode(this._bobrilNode.current) as HTMLDivElement;

    }

    get currentValue(): T {
        HookRenderer.rerender();
        return this._currentValue;
    }

    get bobrilNode(): { current: b.IBobrilCacheNode } {
        return this._bobrilNode;
    }

    get element(): HTMLDivElement {
        return this._domNode;
    }

    changeDependencies(...dependencies: P): void {
        this._dependencies = dependencies;
        HookRenderer.rerender();
    }

    private static rerender(): void {
        b.invalidate();
        b.syncUpdate();
    }
}

export function clean() {
    b.removeRoot("0");
}