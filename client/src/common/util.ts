export function exists<T>(obj:T|undefined|null):obj is T {
    return typeof obj !== 'undefined' &&
        obj !== null;
}