"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const redisClient_1 = __importDefault(require("../lib/redisClient"));
const error_1 = require("../models/error");
//3RD api supports only these, if we put another airport code it should return an error code 40X
const SUPPORTED_PLACES = new Set([
    "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
    "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
    "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
    "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
    "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
]);
//Set used for sorting
const ALLOWED_SORT_BY = new Set(['cheapest', 'fastest']);
class TripService {
    //DI 
    constructor(tripRepo) {
        this.tripRepo = tripRepo;
    }
    async searchTrips(origin, destination, sort_by) {
        /* So here i added validations so it should support only places included on the api,
         i stored everything into a set but it can be done by using |
        | database by fetching all the airports.|
        */
        if (!origin || !SUPPORTED_PLACES.has(origin.toUpperCase())) {
            throw new error_1.HttpError(400, `Airport does not exist: origin '${origin}'`);
        }
        if (!destination || !SUPPORTED_PLACES.has(destination.toUpperCase())) {
            throw new error_1.HttpError(400, `Airport does not exist: destination '${destination}'`);
        }
        if (!sort_by || !ALLOWED_SORT_BY.has(sort_by.toLowerCase())) {
            throw new error_1.HttpError(400, `Invalid sort_by parameter: '${sort_by}'`);
        }
        /* Data validations so even if user inputs lowercase then it is going to work
       */
        origin = origin.toUpperCase();
        destination = destination.toUpperCase();
        sort_by = sort_by.toLowerCase();
        //logs but we can add a condition to for testing and production 
        console.log("searchTrips called with:", origin, destination, sort_by);
        //firstly trying to find the there is any key on redis based on the request parameters,
        //  if found then just return that as response so we just minimize 3rd API Calls
        const cacheKey = `${origin}-${destination}-${sort_by}`;
        const cached = await redisClient_1.default.get(cacheKey);
        if (cached) {
            console.log(`[Cache] Hit for key: ${cacheKey}`);
            return JSON.parse(cached);
        }
        //Using proccess env to retrieve credentials and url for security reasons
        const baseUrl = process.env.TRIPS_API_URL;
        const apiKey = process.env.API_KEY;
        //creating the url format for get request so all the parameters
        //  are sent to the provided 3rd party API 
        const url = new URL(baseUrl);
        url.searchParams.append('origin', origin);
        url.searchParams.append('destination', destination);
        url.searchParams.append('sort_by', sort_by);
        //Logging but should be removed in production
        // console.log(`[TripService] Fetching trips from URL: ${url.toString()}`);
        // console.log(`[TripService] Using API Key: ${apiKey}`);
        //Api call, fetching 3rd Party API data.
        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new error_1.HttpError(response.status, `Fetch error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log(`[TripService] Fetched ${data.length} trips from external API`);
            //Filtering results
            const results = data.filter((trip) => trip.origin === origin && trip.destination === destination);
            console.log(`[TripService] Filtered trips count: ${results.length}`);
            //Sorting results based on what user sent as parameter, 
            // it is done by using arrays Sort function.
            //  Also the same for cheapest we will get the lowest ones.
            const sorted = results.sort((a, b) => {
                if (sort_by === 'fastest')
                    return a.duration - b.duration;
                if (sort_by === 'cheapest')
                    return a.cost - b.cost;
                return 0;
            });
            console.log(`[TripService] Sorted trips by: ${sort_by}`);
            // I/O Operation storing data to redis 
            //storing key into redis so next time we try to fetch this api with the same request body 
            // it will find the response on RAM, basically where redis cache is stored
            await redisClient_1.default.set(cacheKey, JSON.stringify(sorted), { EX: 60 });
            //Confirmation log for testing purposes
            console.log(`[Cache] Set cache for key: ${cacheKey} with expiry 60s`);
            return sorted;
        }
        catch (error) {
            console.error('[TripService] Error fetching trips:', error);
            throw error;
        }
    }
}
exports.TripService = TripService;
