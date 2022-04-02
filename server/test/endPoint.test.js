const request = require('supertest');
const app = require('../server');

describe('Post Endpoints', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/v1/users/')
            .send({
                name: "Jubaidul Alam",
                email: "jubaidul.ctg.bd@gmail.com",
                password: "123456"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.status).toEqual('Success');
    });
});