import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './lib/swagger.json';
import './lib/redisClient';
import tripRoutes from './routes/tripRoutes';
import cors from 'cors';


dotenv.config();

const app = express();

//CORS options, in order to allow traffic from this ip, if we want any ip then just do ` origin: '*' `,
const corsOptions = {
  origin: ['http://172.19.0.40:3000', 'http://localhost:3000', 'http://host.docker.internal:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

//Used Cors to allow http requests from my front-end app  that i made for presentation on NEXTJS 14 Framework
app.use(cors(corsOptions));
app.use(express.json());

//Creating main routes
app.use('/api', tripRoutes);

//Endpoint for Swagger Documentation, so the Devs can test the API from there or we could just use Postman.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tripplanner';


//Creating connection between our API and Database, on this case i used MongoDB which is noSQL language 
// and stores everything into collections and documents
//since we are not working with data that have very high level
//  of relationships between them.
//  Usually use Prisma ORM to interact with SQL databases like PostgreSQL if it was another case. 
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));