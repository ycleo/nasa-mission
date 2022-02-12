const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const habitablePlanets = [];

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
        .on('data', (data) => {  // get one planet data
            if (isHabitable(data))
            habitablePlanets.push(data);
        })
        .on('error', (err) => {  // print the error message if error happened
            console.log(err);
            reject(err);
        })
        .on('end', () => {      
            console.log(habitablePlanets.map((planet) => {
                return planet['kepler_name'];
            }));
            console.log(`There are ${habitablePlanets.length} habitable planets.`);
            resolve();
        }); 
    });
}

module.exports = {
    loadPlanetsData,
    planets: habitablePlanets,
};
