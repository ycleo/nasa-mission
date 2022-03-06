const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');''
// const habitablePlanets = [];
const planets = require('./planets.mongo'); // "planets" collection

/* GET all planets */
async function getAllPlanets () {
    // return habitablePlanets;
    return await planets.find({}, {'_id': 0, '__v': 0}); 
    // The first bracket is "filter": to set the target properties we are finding
    // In this case, the bracket is empty => means no filter or restriction => find all
    // The second bracket is "projection": to "exclude" some return properties => set them to '0' (false)
}

/* POST all habitable planets: laodPlanetsData (check server.js file) */

// The filter of habitable planets
const isHabitable = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

// Save a new filtered (habitable) planet to DB 
// upsert: insert + update
async function savePlanet (planet) {
    try {
        await planets.updateOne({ keplerName: planet.kepler_name }, // find the planet that matches the name 
            { keplerName: planet.kepler_name }, { upsert: true }); // create the planet document only if it doesn't match
    } catch (error) {
        console.log(`Could not save planet because... ${error}`);
    }
}

function loadPlanetsData () {
    return new Promise((resolve, reject) => {

        fs.createReadStream(path.join(__dirname, '../../data/kepler_data.csv'))
        .pipe(parse({      // connect a stream.Readable source to a stream.Writable destination
            comment: '#',  // treat all the characters after this one as a comment
            columns: true, // infer the columns names from the first line.
        }))   
        .on('data', async (data) => {  // get one planet data
            if (isHabitable(data)) {
                // await habitablePlanets.push(data);
                // await planets.create({keplerName: data.kepler_name});
                await savePlanet(data); 
            }
        })
        .on('error', (err) => {  // print the error message if error happened
            console.log(err);
            reject(err);
        })
        .on('end', async () => {      
            // console.log(habitablePlanets.map((planet) => {
            //     return planet['kepler_name'];
            // }));
            const allPlanets = await getAllPlanets();
            const planetsCount = allPlanets.length;
            console.log(`There are ${planetsCount} habitable planets.`);
            resolve();
        }); 
    });
}

module.exports = {
    getAllPlanets,
    loadPlanetsData,
};
