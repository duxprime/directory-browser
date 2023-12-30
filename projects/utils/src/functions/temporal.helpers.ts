/**
 * Syntax sugar for pausing for a delay using a promise.
 * Best used with `await` syntax.
 * 
 * @param time Minimum amount of time to wait in milliseconds.
 */
export function wait(time: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), time);
    });
}