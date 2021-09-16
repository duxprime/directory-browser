"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticIdService = exports.IdService = void 0;
const ENCODING_SCHEME = 'base64';
class IdService {
    createId(path) {
        return Buffer.from(path).toString(ENCODING_SCHEME);
    }
    resolveId(id) {
        return Buffer.from(id, ENCODING_SCHEME).toString();
    }
}
exports.IdService = IdService;
exports.StaticIdService = new IdService();
//# sourceMappingURL=id.service.js.map