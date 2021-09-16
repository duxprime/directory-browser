export function exists<T>(obj: T | undefined | unknown): obj is T {
    return typeof obj !== 'undefined' && obj !== null;
}