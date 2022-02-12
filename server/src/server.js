const http = require('http');

const app = require('./app');
// add express app middleware on top of the built-in http server
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

server.listen(() => {
    console.log(`Server is listening on port ${PORT}...`)
});


