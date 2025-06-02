import { TripController } from '../tripController';
import { TripService } from '../../services/tripService';
import { TripRepository } from '../../services/tripRepo';
import { HttpError } from '../../models/error';

// Mocks for express methods 
const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
const mockSend = jest.fn();

// helper to create a mocked res object for tests
const mockResponse = () =>
  ({
    status: mockStatus,
    json: mockJson,
    send: mockSend,
  } as any);



describe('TripController', () => {
  let controller: TripController;
  let tripService: jest.Mocked<TripService>;
  let tripRepo: jest.Mocked<TripRepository>;

  beforeEach(() => {
    // Here we are mocking just a method for example searchTrips()
    tripService = {
      searchTrips: jest.fn(),
    } as any;

    tripRepo = {
      saveTrip: jest.fn(),
      getTrips: jest.fn(),
      deleteTrip: jest.fn(),
    } as any;

    // Instantiate controller with mocked services
    controller = new TripController(tripService, tripRepo);
  });

  describe('searchTrips', () => {
    it('should return trips sorted by fastest', async () => {
      // Creating a fake request for fastest sorting
      const req = {
        query: {
          origin: 'LAX',
          destination: 'JFK',
          sort_by: 'fastest',
        },
      } as any;

      const res = mockResponse();
      const fakeTrips = [{ id: '123', from: 'LAX', to: 'JFK' }];

      // Mock the service to return fake trips
      tripService.searchTrips.mockResolvedValue(fakeTrips);

      // Callin searchtrips method on controller
      await controller.searchTrips(req, res);

      // checking if service got the right parameters
      expect(tripService.searchTrips).toHaveBeenCalledWith('LAX', 'JFK', 'fastest');
      // Checkin if res called with trips
      expect(mockJson).toHaveBeenCalledWith(fakeTrips);
    });

    it('should return trips sorted by cheapest', async () => {
            // Creating a fake request for cheapest sorting
      const req = {
        query: {
          origin: 'LAX',
          destination: 'JFK',
          sort_by: 'cheapest',
        },
      } as any;

      const res = mockResponse();
      const fakeTrips = [{ id: '123', from: 'LAX', to: 'JFK' }];

      tripService.searchTrips.mockResolvedValue(fakeTrips);

      await controller.searchTrips(req, res);

      //so here we are checking if the parameters passed correspond to the ones passed on req
      expect(tripService.searchTrips).toHaveBeenCalledWith('LAX', 'JFK', 'cheapest');
      expect(mockJson).toHaveBeenCalledWith(fakeTrips);
    });
  });
});
