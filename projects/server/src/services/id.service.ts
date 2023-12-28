const ENCODING_SCHEME = 'base64';

export class IdService {
    /** 
    * Creates a unique ID from a given file path.
    * 
    * @returns An ID uniquely idenitfying the item at the path.
    */
    public createId(path: string) {
        return Buffer.from(path).toString(ENCODING_SCHEME);
    }

    /**
     * @param id The unique ID of a directory item.
     * @returns The path on disk the item resides at.
     */
    public resolveId(id: string) {
        return Buffer.from(id, ENCODING_SCHEME).toString();
    }
}

/**
 * Canned `IdService` instance for when injecting via DI may be inconvenient.
 */
export const StaticIdService = new IdService();