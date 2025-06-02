import { TripModel } from '../models/tripModel';

export class TripRepository {
  //Repository function Saving, geting all trips and
  //  deleting a trip based on ID (mongo ID) using Mongo DB query
  // functions like save(), find() or findByIdAndDelete(id)
  async saveTrip(data: any) {
    const trip = new TripModel(data);
    return await trip.save();
  }

  async getTrips() {
    return await TripModel.find();
  }

  async deleteTrip(id: string) {
    return await TripModel.findByIdAndDelete(id);
  }
}
