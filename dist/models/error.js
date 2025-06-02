"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
//My own error class
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }
}
exports.HttpError = HttpError;
