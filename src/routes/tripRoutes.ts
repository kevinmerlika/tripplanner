import { Router } from 'express';
import { TripController } from '../controllers/tripController';
import { tripRepo, tripService } from '../singletons';

const router = Router();

const tripController = new TripController(tripService, tripRepo);

router.get('/search', tripController.searchTrips.bind(tripController));
router.post('/save', tripController.saveTrip.bind(tripController));
router.get('/saved', tripController.getSavedTrips.bind(tripController));
router.delete('/delete/:id', tripController.deleteTrip.bind(tripController));

export default router;
