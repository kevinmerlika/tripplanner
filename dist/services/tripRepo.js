"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripRepository = void 0;
const tripModel_1 = require("../models/tripModel");
class TripRepository {
    //Repository function Saving, geting all trips and
    //  deleting a trip based on ID (mongo ID) using Mongo DB query 
    // functions like save(), find() or findByIdAndDelete(id)
    async saveTrip(data) {
        const trip = new tripModel_1.TripModel(data);
        return await trip.save();
    }
    async getTrips() {
        return await tripModel_1.TripModel.find();
    }
    async deleteTrip(id) {
        return await tripModel_1.TripModel.findByIdAndDelete(id);
    }
}
exports.TripRepository = TripRepository;
