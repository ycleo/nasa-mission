const express = require('express');

const api = express.Router();

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

api.use('/planets', planetsRouter); // middleware to load the planetsRouter on '/planets' path
api.use('/launches', launchesRouter); // middleware to load the launchesRouter on '/launches' path

module.exports = api;