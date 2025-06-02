import { Request, Response } from 'express';
import { TripService } from '../services/tripService';
import { TripRepository } from '../services/tripRepo';
import { HttpError } from '../models/error';


export class TripController {
  private tripService: TripService;
  private tripRepo: TripRepository;

  //Dependency injection, could have used a library like tsyringe 
  constructor(tripService: TripService, tripRepo: TripRepository) {
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
  async searchTrips(req: Request, res: Response) {
    const { origin, destination, sort_by } = req.query;

    try {
      const trips = await this.tripService.searchTrips(
        origin as string,
        destination as string,
        sort_by as string
      );
      res.json(trips);
    } catch (err) {
      // Check if error is an instance of HttpError and sending proper status + message
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        console.error('[TripController] Unexpected error:', err);
        res.status(500).json({ error: 'Failed to search trips' });
      }
    }
  }

  async saveTrip(req: Request, res: Response) {
    try {
      const saved = await this.tripRepo.saveTrip(req.body);
      console.log("request made");
      
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save trip' });
    }
  }

  async getSavedTrips(_req: Request, res: Response) {
    try {
      const trips = await this.tripRepo.getTrips();
      console.log(trips);
      
      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch saved trips' });
    }
  }

  async deleteTrip(req: Request, res: Response) {
    try {
        console.log("Delete req made");
        console.log(req.params.id);
        
      await this.tripRepo.deleteTrip(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete trip' });
    }
  }
}
