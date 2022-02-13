const launches = new Map();

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'spaceX model 5.0',
    launchDate: new Date('December 12, 2033'),
    destination: 'Kepler-442 b',
    customer: ['Taiwan', 'Elon Musk'],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);

// "separation of concern": model should processe data before controller usage
function getAllLaunches () {
    return Array.from(launches.values());
}

module.exports = {
    getAllLaunches,
};