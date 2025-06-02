import { TripRepository } from './services/tripRepo';
import { TripService } from './services/tripService';

const tripRepo = new TripRepository();
const tripService = new TripService(tripRepo);

export { tripRepo, tripService };
