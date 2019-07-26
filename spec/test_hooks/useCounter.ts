import * as b from "bobril";

export interface ICounter {
    count: number;
    increment: () => void;
    decrement: () => void;
}

export function useCounter(initialCount = 0): ICounter {
    const [count, setCount] = b.useState(initialCount);
    function increment() {
        setCount(count => count + 1);
    }

    function decrement() {
        setCount(count => count - 1);
    }
    return {
        count,
        increment,
        decrement
    }
}