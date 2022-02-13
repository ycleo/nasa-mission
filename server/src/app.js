const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const planetsRouter = require('./routes/planets/planets.router');

app.use(cors({ // middleware to set the cors rule
    origin: 'http://localhost:3000'
})); 
app.use(express.json()); // middleware that only parses json
app.use(express.static(path.join(__dirname, '..', 'public'))); // middleware to serve static files
app.use(planetsRouter); // middleware to connect to planets router
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;