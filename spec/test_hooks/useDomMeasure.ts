import * as b from "bobril";

export interface MeasuredBox {
    bottom: number;
    left: number;
    right: number;
    top: number;
    width: number;
    height: number;
}

export function useMeter(ref: {current: b.IBobrilCacheNode}): MeasuredBox {
    let [currentBox, setCurrentBox] = b.useState<MeasuredBox>({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        bottom: 0,
        right: 0
    });
    b.useLayoutEffect(() => {
        if(ref.current) {
            const newBox = (b.getDomNode(ref.current) as Element).getBoundingClientRect();
            if (
                currentBox.left != newBox.left ||
                currentBox.top != newBox.top ||
                currentBox.width != newBox.width ||
                currentBox.height != newBox.height
            ) {
                setCurrentBox({
                    left: newBox.left,
                    top: newBox.top,
                    width: newBox.width,
                    bottom: newBox.bottom,
                    right: newBox.right,
                    height: newBox.height
                });
            }
        }
    });
    return currentBox;
}