"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripService = exports.tripRepo = void 0;
// src/singletons.ts
const tripRepo_1 = require("./services/tripRepo");
const tripService_1 = require("./services/tripService");
const tripRepo = new tripRepo_1.TripRepository();
exports.tripRepo = tripRepo;
const tripService = new tripService_1.TripService(tripRepo);
exports.tripService = tripService;
