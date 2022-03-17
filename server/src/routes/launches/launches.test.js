const request = require('supertest');
const app = require('../../app');
const { loadPlanetsData, } = require('../../models/planets.model');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

const correctLaunchData = {
    mission: 'USS enterprise',
    rocket: 'spaceX model X',
    target: 'Kepler-62 f',
    launchDate: 'January 4, 2025', 
};

const launchDataWithoutDate = {
    mission: 'USS enterprise',
    rocket: 'spaceX model X',
    target: 'Kepler-62 f',
};

const launchDataWithInvalidDate = {
    mission: 'USS enterprise',
    rocket: 'spaceX model X',
    target: 'Kepler-62 f',
    launchDate: 'invalid date',
}


describe('Launches APIs testing: ', () => {
    // beforeAll => Test DB connection first
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });

    // afterAll => disconnect DB
    afterAll(async () => {
        await mongoDisconnect();
    });

    // Test GET method
    describe('Test GET /launches', () => {
        test('It should response with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    // Test POST method
    describe('Test POST /launch', () => {

        test('It should response with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(correctLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
        
            const requestDate = new Date(correctLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(requestDate).toBe(responseDate);  
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch information',
            });
        });

        test('It should catch invalid date', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });
    });
});

