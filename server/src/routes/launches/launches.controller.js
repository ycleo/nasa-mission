const { 
    getAllLaunches, 
    addNewLaunch, 
    launchExists, 
    abortLaunchById 
} = require('../../models/launches.model');

async function httpGetAllLaunches (req, res) {
    return res.status(200).json(await getAllLaunches());
}

function httpAddNewLaunch (req, res) {
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

    addNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch (req, res) {
    const launchId = Number(req.params.id);
    // 1. check the launch id exists
    if (!launchExists(launchId)) {
        return res.status(404).json({
            error: "Launch not found",
        });
    }
    // 2. abort the launch
    const abortedLaunch = abortLaunchById(launchId);
    return res.status(200).json(abortedLaunch);
}

module.exports = { 
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};