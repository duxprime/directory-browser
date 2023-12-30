export function coerceToArray<T>(maybeArr: T | T[]) {
    return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}