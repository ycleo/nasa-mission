const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const server = http.createServer(app); // add express app middleware on top of the built-in http server
const PORT = process.env.PORT || 8000; // process.env.PORT can be found in package.json (PORT=5000)
const MONGO_URL = 'mongodb+srv://rocket-mission-api:UbQAOCQgGleUyDmO@cluster0.9ycev.mongodb.net/rocket?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
    console.log('MongoDB conncetion OK!');
});

mongoose.connection.on('error', (error) => {
    console.error(error);
});

// Why using asynce await syntax? => we want to perform certain actions before server start to response clients
async function startServer () {
    mongoose.connect(MONGO_URL); // use mongoose api to connect to remote MongoDB 
    await loadPlanetsData(); // load the filtered planets' data 

    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}...`);
    });
}

startServer();


