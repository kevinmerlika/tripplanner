BEFORE RUNNING !!!!!
//You need to use these docker images for database and caching

docker pull redis:latest
docker pull mongo:latest

//Run these images on these ports before running api !!! 

docker run -d -p 6379:6379 --name redis redis:latest
docker run -d -p 27017:27017 --name mongo mongo:latest


//Also create .env file in root directory 

PORT=4000

MONGO_URI=mongodb://localhost:27017/tripplanner

API_KEY= api key

REDIS_URL=redis://localhost:6379

TRIPS_API_URL= your url

Cannot share url and api key, database and redis is shared since it will run on your machine for testing purposes

//Testing using Postman, import postman.json which is on root directory (copy paste) into Postman -> Import , or go to Swagger Documentation  -->  http://localhost:4000/docs/  

Thank you
