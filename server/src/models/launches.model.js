// "separation of concern": model should processe data before controller usage
// ".mongo" should be the lower layer to support ".model", and each ".model" are better to not intertwine
const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 100;

// let latestFlightNumber = 100;
// const launches = new Map();
// const launch = {
//     flightNumber: 100,
//     mission: 'Kepler Exploration X',
//     rocket: 'spaceX model 5.0',
//     launchDate: new Date('December 12, 2033'),
//     target: 'Kepler-442 b',
//     customer: ['Taiwan', 'Elon Musk'],
//     upcoming: true,
//     success: true,
// };
// launches.set(launch.flightNumber, launch);
// saveLaunch(launch);

/* GET all launches in remote MongoDB */ 
async function getAllLaunches () {
    // return Array.from(launches.values());
    return await launchesDB.find({}, {'_id': 0, '__v': 0});
    // The first bracket is "filter": to set the target properties we are finding
    // In this case, the bracket is empty => means no filter or restriction => find all
    // The second bracket is "projection": to "exclude" some return properties => set them to '0' (false)
}

/* POST (Add) a new launch to remote MongoDB */
// Flow:
// 1. get the new flight number
// 2. create a new launch object
// 3. check the target planet exists 
// 4. save the launch to MongoDB

// To detemine the latest flight number
async function getLatestFlightNumber () {
    // Find the first launch that the flightNumber was sorted descendingly ('-') 
    const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

// To save the lauch into DB
async function saveLaunch (launch) {
    // check the target planet of the launch exists or not
    const targetPlanet = await planets.findOne({keplerName: launch.target}); 
    if(!targetPlanet) {
        throw new Error("No matching planet found...");
    }
    // save the new launch to remote MongoDB
    await launchesDB.findOneAndUpdate({flightNumber: launch.flightNumber}, // find the launch that matches the name 
                               launch, {upsert: true}); // create the launch document only if it doesn't match
}

async function addNewLaunch (launch) {
    // 1. get a new flight number
    const newFlightNumber = await getLatestFlightNumber() + 1;
    // 2. create a new launch object
    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['Taiwan', 'Jeff Bezos'],
        upcoming: true,
        success: true,
    });
    // 3~4. save the launch to MongoDB
    await saveLaunch(newLaunch);
}
// function addNewLaunch (launch) {
//     latestFlightNumber++;
//     launches.set(latestFlightNumber, 
//         Object.assign(launch, 
//             {
//                 flightNumber: latestFlightNumber,
//                 customer: ['Taiwan', 'Elon Musk'],
//                 upcoming: true,
//                 success: true,
//             }));
// }

/* DELETE (Abort) the lauch from upcoming mission list */

// To check a specific launch exists or not by its flightNumber
async function launchExistsWithFlightNumber (launchFlightNumber) {
    // return launches.has(launchFlightNumber);
    return await launchesDB.findOne({
        flightNumber: launchFlightNumber
    });
}

async function abortLaunchByFlightNumber (launchFlightNumber) {
    // find the launch by its flight number and update its properties: upcoming & success
    const aborted = await launchesDB.updateOne({
        flightNumber: launchFlightNumber
    },{
        upcoming: false,
        success: false,
    });
    // console.log(aborted);
    // return the updated (aborted) result
    return aborted.acknowledged === true && aborted.matchedCount === 1;

    // const abortedLaunch = launches.get(launchFlightNumber);
    // abortedLaunch.upcoming = false;
    // abortedLaunch.success = false;
    // return abortedLaunch;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    launchExistsWithFlightNumber,
    abortLaunchByFlightNumber,
};