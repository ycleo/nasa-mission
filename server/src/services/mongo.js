require('dotenv').config();
const mongoose = require('mongoose');

async function mongoConnect () {
    await mongoose.connect(process.env.MONGO_URL); // use mongoose api to connect to remote MongoDB 
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