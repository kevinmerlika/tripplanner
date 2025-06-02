"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tripSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    origin: String,
    destination: String,
    cost: Number,
    duration: Number,
    type: String,
    display_name: String,
});
exports.TripModel = mongoose_1.default.model('Trip', tripSchema);
