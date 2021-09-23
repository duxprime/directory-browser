export function exists<T>(obj: T | undefined | unknown | null): obj is T {
    return typeof obj !== 'undefined' && obj !== null;
}