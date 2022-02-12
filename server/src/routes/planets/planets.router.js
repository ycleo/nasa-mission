const express = require('express');
const { getAllPlanets, } = require('./planets.controller');

const planetsRouter = express.Router(); // set up the router for plantes

// set up the action, endpoint and controller functions
planetsRouter.get('/planets', getAllPlanets);

module.exports = planetsRouter;

