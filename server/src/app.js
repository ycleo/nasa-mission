const express = require('express');
const cors = require('cors');

const app = express();
const planetsRouter = require('./routes/planets/planets.router');

app.use(cors({ // middleware to set the cors rule
    origin: 'http://localhost:3000'
})); 
app.use(express.json()) // middleware that only parses json
app.use(planetsRouter); // middleware to connect to planets router

module.exports = app;