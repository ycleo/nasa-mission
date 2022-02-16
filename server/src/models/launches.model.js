const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'spaceX model 5.0',
    launchDate: new Date('December 12, 2033'),
    target: 'Kepler-442 b',
    customer: ['Taiwan', 'Elon Musk'],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);

// "separation of concern": model should processe data before controller usage
function getAllLaunches () {
    return Array.from(launches.values());
}

function addNewLaunch (launch) {
    latestFlightNumber++;
    launches.set(latestFlightNumber, 
        Object.assign(launch, 
            {
                flightNumber: latestFlightNumber,
                customer: ['Taiwan', 'Elon Musk'],
                upcoming: true,
                success: true,
            }));
}

function launchExists (id) {
    return launches.has(id);
}

function abortLaunchById (id) {
    const abortedLaunch = launches.get(id);
    abortedLaunch.upcoming = false;
    abortedLaunch.success = false;
    return abortedLaunch;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    launchExists,
    abortLaunchById,
};