import { Request, Response } from 'express';
import { TripService } from '../services/tripService';
import { TripRepository } from '../services/tripRepo';
import { HttpError } from '../models/error';

export class TripController {
  private tripService: TripService;
  private tripRepo: TripRepository;

  //Dependency injection, could have used a library like tsyringe but since it is not a complex api just followed traditional way
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
        sort_by as string,
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

  /**
   * @route POST /api/save
   * @description Saves a trip to mongo
   * @param {Request} req - request
   * @param {Response} res - response
   * @body {Trip} req.body - The trip object which will be saved
   * @returns {Trip} 201 - The saved trip object on mongo
   * @returns {HttpError} 500 - If saving fails
   */

  async saveTrip(req: Request, res: Response) {
    try {
      const saved = await this.tripRepo.saveTrip(req.body);
      // console.log("request made");

      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save trip' });
    }
  }

  /**
   * @route GET /api/saved
   * @description Retrieves all saved trips from mongodb
   * @param {Request} _req - request object , in this case it is not used
   * @param {Response} res - response
   * @returns {Trip[]} 200 - Array of saved trips
   * @returns {HttpError} 500 - If fetch fails
   */

  async getSavedTrips(_req: Request, res: Response) {
    try {
      const trips = await this.tripRepo.getTrips();
      // console.log(trips);

      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch saved trips' });
    }
  }

  /**
   * @route DELETE /api/delete/:id
   * @description Deletes a trip by using id.
   * @param {Request} req - request
   * @param {Response} res - response
   * @param {string} req.params.id - ID of trip that should be deleted
   * @returns {void} 204 - just status code is returned
   * @returns {HttpError} 500 - If delete fails
   */

  async deleteTrip(req: Request, res: Response) {
    try {
      // console.log("Delete req made");
      // console.log(req.params.id);

      await this.tripRepo.deleteTrip(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete trip' });
    }
  }
}
