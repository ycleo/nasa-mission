const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://rocket-mission-api:UbQAOCQgGleUyDmO@cluster0.9ycev.mongodb.net/rocket?retryWrites=true&w=majority';

async function mongoConnect () {
    await mongoose.connect(MONGO_URL); // use mongoose api to connect to remote MongoDB 
};

mongoose.connection.once('open', () => {
    console.log('MongoDB conncetion OK!');
});

mongoose.connection.on('error', (error) => {
    console.error(error);
});

async function mongoDisconnect () {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};