BEFORE RUNNING !!!!!

//Clone this repo

git clone https://github.com/kevinmerlika/tripplanner.git

//You need to use these docker images for database and caching

docker pull kevinmerlika98/trip-front-image:latest

docker pull redis:latest

docker pull mongo:latest

//Run these images on these ports before running api !!!

docker run -d -p 6379:6379 --name redis redis:latest

docker run -d -p 27017:27017 --name mongo mongo:latest


//Optional-------------------------------------------------------------------

docker run -d --name trip-front -p 3000:3000 kevinmerlika98/trip-front-image|

----------------------------------------------------------------------------|


//Also create .env file in root directory

PORT=4000

MONGO_URI=mongodb://localhost:27017/tripplanner

API_KEY= api key

REDIS_URL=redis://localhost:6379

TRIPS_API_URL= your url

Cannot share url and api key, database and redis is shared since it will run on your machine for testing purposes

//Testing using Postman, import postman.json which is on root directory (copy paste) into Postman -> Import , or go to Swagger Documentation --> http://localhost:4000/docs/

//If you need to check how data is stored install MongoDBCompass and connect to database with url " mongodb://localhost:27017 "
//Go to tripplaner database -> trips -> press button Find

//Run by using command " npm start " after turning on required docker containers like Mongo and Redis, also creating the .env file on root directory based on above text. Front-End docker container is optional if you would like to test it.

//I have added a test for a method searchtrip on tripController, run by using command "npm test"

Thank you
