const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches (req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch (req, res) {
    const launch = req.body;
    // check if any info is missing
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
        return res.status(400).json({
            error: 'Missing required launch information',
        });
    }
    // check if the date is match the format
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    } 

    launch.launchDate = new Date(launch.launchDate);
    addNewLaunch(launch);
    return res.status(201).json(launch);
}

module.exports = { 
    httpGetAllLaunches,
    httpAddNewLaunch,
};