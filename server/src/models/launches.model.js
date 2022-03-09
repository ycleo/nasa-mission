/* 
  Important Concept!!!
 "separation of concern": model should process data before controller usage
*/
const axios = require('axios');

// ".mongo" should be the lower layer to support ".model", and each ".model" are better to not intertwine
const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 100;

// let latestFlightNumber = 100;
// const launches = new Map();
// const launch = {
                                                    // -> mapping with spaceX API
//     flightNumber: 100,                           // -> flight_number
//     mission: 'Kepler Exploration X',             // -> name
//     rocket: 'spaceX model 5.0',                  // -> rocket.name
//     launchDate: new Date('December 12, 2033'),   // -> date_local
//     target: 'Kepler-442 b',                      // not applicable
//     customers: ['Taiwan', 'Elon Musk'],           // -> payload.customer for each payload
//     upcoming: true,                              // -> upcoming
//     success: true,                               // -> success
// };
// launches.set(launch.flightNumber, launch);
// saveLaunch(launch);

// To find launch with filter (check the specific launch exists)
async function findLaunch (filter) {
    return await launchesDB.findOne(filter);
}

// To get the latest flight number
async function getLatestFlightNumber () {
    // Find the first launch that the flightNumber was sorted descendingly ('-') 
    const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

// To check a specific launch exists or not by its flightNumber
async function launchExistsWithFlightNumber (launchFlightNumber) {
    // return launches.has(launchFlightNumber);
    // return await launchesDB.findOne({ flightNumber: launchFlightNumber });
    return await findLaunch({
        flightNumber: launchFlightNumber
    });
}

// To save the lauch into MongoDB
async function saveLaunch (launch) {
    await launchesDB.findOneAndUpdate({flightNumber: launch.flightNumber}, // find the launch that matches the name 
                               launch, {upsert: true}); // create the launch document only if it doesn't match
}

// To populate SpaceX history launches 
async function populateLaunches () {
    console.log('Downloading launch data...');
    // query the launches information including the rocket name and customers
    const response = await axios.post(process.env.SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                { path: 'rocket', select: { name: 1 } }, 
                { path: 'payloads', select: { customers: 1 } }
            ]
        }
    });

    // if history data fetching failed
    if (response.status !== 200) {
        console.log('Problem getting SpaceX history data...');
        throw new Error('SpaceX history data download failed...');
    } 

    // (axios library) response.data returns the HTTP response body at the server we requested.
    const launchDocs = response.data.docs;
    // loop through each launch doc
    for (const launchDoc of launchDocs) {
        // 1. get all the customers from each payload and make them all together into one customers array
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });
        // 2. extract the useful information from doc and make an launch object
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],  
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],                
            customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
        };
        console.log(`${launch.flightNumber}. ${launch.launchDate} Mission "${launch.mission}" was sponsored by ${launch.customers}.`);
        // 3. save the launch object to MongoDB
        await saveLaunch(launch);
    }
}

/* GET the launches data from SpaceX API */ 
async function loadLaunchesData () {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if (firstLaunch) {
        console.log('SpaceX launch data has been loaded...');
    } else {
        await populateLaunches();
    }
}

/* GET all launches in remote MongoDB */ 
async function getAllLaunches (skip, limit) {
    // return Array.from(launches.values());
    return await launchesDB.find({}, {'_id': 0, '__v': 0})
                           .sort("flightNumber")
                           .skip(skip).limit(limit);
    // find(): The first bracket is "filter" -> To set the target properties we are finding
        // In this case, the bracket is empty -> means no filter or restriction -> find all
        // The second bracket is "projection" -> To "exclude" some return properties => set them to '0' (false)
    // sort(): sort it based on the flightNumber (+: ascending, -: descending)
    // skip() and limit(): the pagination setting
}

/* POST (Add) a new launch to remote MongoDB */
async function addNewLaunch (launch) {
    // 1. check the target planet of the launch exists or not
    const targetPlanet = await planets.findOne({keplerName: launch.target}); 
    if(!targetPlanet) {
        throw new Error("No matching planet found...");
    }
    // 2. get a new flight number
    const newFlightNumber = await getLatestFlightNumber() + 1;
    // 3. create a new launch object
    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['Taiwan', 'Jeff Bezos'],
        upcoming: true,
        success: true,
    });
    // 4. save the launch to MongoDB
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
    loadLaunchesData,
    getAllLaunches,
    addNewLaunch,
    launchExistsWithFlightNumber,
    abortLaunchByFlightNumber,
};