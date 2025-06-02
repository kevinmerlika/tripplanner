"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./lib/swagger.json"));
require("./lib/redisClient");
const tripRoutes_1 = __importDefault(require("./routes/tripRoutes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//CORS options, in order to allow traffic from this ip, if we want any ip then just do ` origin: '*' `,
const corsOptions = {
    origin: ['http://172.19.0.40:3000', 'http://localhost:3000', 'http://host.docker.internal:3000'],
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};
//Used Cors to allow http requests from my front-end app  that i made for presentation on NEXTJS 14 Framework
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
//Creating main routes
app.use('/api', tripRoutes_1.default);
//Endpoint for Swagger Documentation, so the Devs can test the API from there or we could just use Postman.
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tripplanner';
//Creating connection between our API and Database, on this case i used MongoDB which is noSQL language 
// and stores everything into collections and documents
//since we are not working with data that have very high level
//  of relationships between them.
//  Usually use Prisma ORM to interact with SQL databases like PostgreSQL if it was another case. 
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => console.error('MongoDB connection error:', err));
