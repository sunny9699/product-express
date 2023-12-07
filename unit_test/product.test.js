const request = require('supertest');
const app = require('../products')

describe('GET /', () => {
    let id;
    it('Get products', async () => {
        const response = await request(app).get('/get-product');
        expect(response.statusCode).toBe(200);
    });

    it('Create product', async () => {
        const response = await request(app).post('/product').attach('image', 'download.png').field('name', 'UID');
        id = response.body.id;
        console.log(id);
        expect(response.statusCode).toBe(201);
    });

    it('Update Product', async () => {
        const response = await request(app).put(`/update-product/${id}`).attach('image', 'download.png').field('name', 'SUM');
        expect(response.statusCode).toBe(200);
    });
});
