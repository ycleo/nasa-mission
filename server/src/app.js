const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

app.use(cors({ // middleware to set the cors rule
    origin: 'http://localhost:3000'
})); 
app.use(morgan('combined')); // middleware to record the client log
app.use(express.json());    // middleware that only parses json
app.use(express.static(path.join(__dirname, '..', 'public'))); // middleware to serve static files
app.use('/planets', planetsRouter); // middleware to connect to planets router
app.use('/launches', launchesRouter); // middleware to connect to launches router

app.get('/*', (req, res) => {  // express will match the end point that was not found in the above routes
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); 
    // will pass the end point(*) to index.html for react app to do the rendering
});

module.exports = app;