"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripController = void 0;
const error_1 = require("../models/error");
class TripController {
    //Dependency injection, could have used a library like tsyringe 
    constructor(tripService, tripRepo) {
        this.tripService = tripService;
        this.tripRepo = tripRepo;
    }
    /**
     * @route GET /api/search
     * @description Searches for trips based on origin, destination, and optional sorting.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @query {string} origin - The origin location code
     * @query {string} destination - The destination location code
     * @query {string} [sort_by] - Sorting criteria
     * @returns {Trip[]} 200 - Array of trip objects
     * @returns {HttpError} 400 - If parameters are invalid
     * @returns {HttpError} 500 - If an unexpected error occurs
     */
    async searchTrips(req, res) {
        const { origin, destination, sort_by } = req.query;
        try {
            const trips = await this.tripService.searchTrips(origin, destination, sort_by);
            res.json(trips);
        }
        catch (err) {
            // Check if error is an instance of HttpError and sending proper status + message
            if (err instanceof error_1.HttpError) {
                res.status(err.statusCode).json({ error: err.message });
            }
            else {
                console.error('[TripController] Unexpected error:', err);
                res.status(500).json({ error: 'Failed to search trips' });
            }
        }
    }
    async saveTrip(req, res) {
        try {
            const saved = await this.tripRepo.saveTrip(req.body);
            console.log("request made");
            res.status(201).json(saved);
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to save trip' });
        }
    }
    async getSavedTrips(_req, res) {
        try {
            const trips = await this.tripRepo.getTrips();
            console.log(trips);
            res.json(trips);
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch saved trips' });
        }
    }
    async deleteTrip(req, res) {
        try {
            console.log("Delete req made");
            console.log(req.params.id);
            await this.tripRepo.deleteTrip(req.params.id);
            res.status(204).send();
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to delete trip' });
        }
    }
}
exports.TripController = TripController;
