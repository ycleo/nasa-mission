require('dotenv').config();
const http = require('http');

const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const server = http.createServer(app); // add express app middleware on top of the built-in http server
const PORT = process.env.PORT; // process.env.PORT can be set in .env or package.json script (PORT=5000)

// Why using asynce await syntax? => we want to perform certain actions before server start to response clients
async function startServer () {
    await mongoConnect(); // Connect to MongoDB
    await loadPlanetsData(); // load the filtered planets' data 
    await loadLaunchesData(); // load the histoy launches' data 

    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}...`);
    });
}

startServer();


