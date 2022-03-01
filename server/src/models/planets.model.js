const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

// const habitablePlanets = [];
const planets = require('./planets.mongo');


const isHabitable = (planet) => {
return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData () {
    return new Promise((resolve, reject) => {

        fs.createReadStream(path.join(__dirname, '../../data/kepler_data.csv'))
        .pipe(parse({      // connect a stream.Readable source to a stream.Writable destination
            comment: '#',  // treat all the characters after this one as a comment
            columns: true, // infer the columns names from the first line.
        }))   
        .on('data', async (data) => {  // get one planet data
            if (isHabitable(data))
                // await habitablePlanets.push(data);
                // TODO: Replace below create with insert + update (upsert)
                // await planets.create({keplerName: data.kepler_name});
                await savePlanet(data);
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

async function getAllPlanets () {
    // return habitablePlanets;
    return await planets.find({}); 
}

async function savePlanet (planet) {
    try {
        await planets.updateOne({ keplerName: planet.kepler_name }, // find the planet that matches the name 
            { keplerName: planets.kepler_name }, { upsert: true }); // create the planet document if it doesn't match
    } catch (error) {
        console.log(`Could not save planet because... ${error}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};
