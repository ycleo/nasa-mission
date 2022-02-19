const request = require('supertest');
const app = require('../../app');

const correctLaunchData = {
    mission: 'USS enterprise',
    rocket: 'spaceX model X',
    target: 'Kepler 12345',
    launchDate: 'January 4, 2025', 
};

const launchDataWithoutDate = {
    mission: 'USS enterprise',
    rocket: 'spaceX model X',
    target: 'Kepler 12345',
};

const launchDataWithInvalidDate = {
    mission: 'USS enterprise',
    rocket: 'spaceX model X',
    target: 'Kepler 12345',
    launchDate: 'invalid date',
}

// Test GET method
describe('Test GET /launches', () => {
    test('It should response with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});

// Test POST method
describe('Test POST /launch', () => {

    test('It should response with 201 created', async () => {
        const response = await request(app)
            .post('/launches')
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
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch information',
        });
    });

    test('It should catch invalid date', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400)

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date',
        });
    })

});