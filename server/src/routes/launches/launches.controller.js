const { 
    getAllLaunches, 
    addNewLaunch, 
    launchExistsWithFlightNumber, 
    abortLaunchByFlightNumber, 
} = require('../../models/launches.model');

const { 
    getPagination,    
} = require('../../services/query');

/* GET all launches */
async function httpGetAllLaunches (req, res) {
    const { skip, limit } = getPagination(req.query);
    launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

/* POST (Add) new launch */
async function httpAddNewLaunch (req, res) {
    const launch = req.body;
    // check if any info is missing
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch information',
        });
    }
    // check if the date match the format
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    } 

    await addNewLaunch(launch);
    return res.status(201).json(launch);
}

/* DELETE (Abort) launch */
async function httpAbortLaunch (req, res) {
    // http://.../launches/:id (id represents the flight number of certain launch)
    const launchFlightNumber = Number(req.params.id);
    // 1. check the launch flight number exists
    const launchExists = await launchExistsWithFlightNumber(launchFlightNumber);
    if (!launchExists) {
        return res.status(404).json({
            error: "Launch not found...",
        });
    }
    // 2. abort the launch
    const abortDone = await abortLaunchByFlightNumber(launchFlightNumber);
    if(!abortDone) {
        return res.status(400).json({
            error: "Abort failed..."
        });
    }
    return res.status(200).json({
        abort: "Done", 
    });
}

module.exports = { 
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};