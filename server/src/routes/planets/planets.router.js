const express = require('express');
const { httpGetAllPlanets, } = require('./planets.controller');

const planetsRouter = express.Router(); // set up the router for plantes

// set up the action, endpoint and controller functions
planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;

