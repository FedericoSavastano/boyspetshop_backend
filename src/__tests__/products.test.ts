import request from 'supertest';
import server from '../server';

describe('POST /api/products', () => {
    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(9);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    });

    it('should validate price greater than zero', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Test Product',
            price: 0,
            amount: 1,
            category: 'Cat food',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    });

    it('should validate price is a number and greater than zero', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Test Product',
            price: 'string',
            amount: 1,
            category: 'Cat food',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(22);
    });

    it('should validate amount is a number', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Test Product',
            price: 50,
            amount: 'none',
            category: 'Cat food',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(22);
    });

    it('should validate price is a number and greater or equal than zero', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Test Product',
            price: 50,
            amount: -2,
            category: 'Cat food',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(22);
    });

    it('should validate category is a string and one of ["Cat food", "Dog food", "Bird food", "Cat accesories", "Dog Accesories"]', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Test Product',
            price: 50,
            amount: 2,
            category: 'cat food',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(22);
    });

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Test Product',
            price: 99,
            amount: 3,
            category: 'Cat accesories',
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(200);
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('GET /api/products', () => {
    it('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products');

        expect(response.status).not.toBe(404);
    });

    it('should send back a json response with one product ', async () => {
        const response = await request(server).get('/api/products');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(1);

        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('GET /api/products', () => {
    it('should reject if invalid id is sent in url', async () => {
        const response = await request(server)
            .get('/api/products/invalid')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
    });

    it('should reject if valid id is sent in url but product is not found', async () => {
        const response = await request(server)
            .get('/api/products/999')
            .send({});
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Product not found');
    });

    it('should recieve a single product', async () => {
        const response = await request(server).get('/api/products/1').send({});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toBeTruthy();

        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('PUT /api/products', () => {
    it('should reject if no id is sent in url', async () => {
        const response = await request(server).put('/api/products/').send({});
        expect(response.status).toBe(404);
    });

    it('should reject if invalid id is sent in url', async () => {
        const response = await request(server)
            .put('/api/products/invalid')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
    });

    it('should display validation errors', async () => {
        const response = await request(server).put('/api/products/1').send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    });

    it('should reject if valid id is sent in url but product is not found and body is empty', async () => {
        const response = await request(server)
            .put('/api/products/999')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
    });

    it('should reject if valid id is sent in url but product is not found', async () => {
        const response = await request(server).put('/api/products/999').send({
            name: 'Test Product',
            price: 1,
            amount: 1,
            category: 'Cat food',
            availability: true,
        });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Product not found');
    });

    it('should validate price greater than zero', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Test Product',
            price: 0,
            amount: 1,
            category: 'Cat food',
            availability: true,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    });

    it('should validate price is a number and greater than zero', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Test Product',
            price: 'string',
            amount: 1,
            category: 'Cat food',
            availability: true,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(22);
    });

    it('should validate amount is a number', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Test Product',
            price: 50,
            amount: 'none',
            category: 'Cat food',
            availability: true,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(22);
    });

    it('should validate price is a number and greater or equal than zero', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Test Product',
            price: 50,
            amount: -2,
            category: 'Cat food',
            availability: true,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(22);
    });

    it('should validate category is a string and one of ["Cat food", "Dog food", "Bird food", "Cat accesories", "Dog Accesories"]', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Test Product',
            price: 50,
            amount: 2,
            category: 'cat food',
            availability: true,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(22);
    });

    it('should validate availability is a boolean "]', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Test Product',
            price: 50,
            amount: 2,
            category: 'Cat food',
            availability: 'boolean_string',
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(22);
    });

    it('should return the edited product', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Test Product Edited',
            price: 100,
            amount: 5,
            category: 'Dog accesories',
            availability: false,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(201);
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('PATCH /api/products', () => {
    it('should reject if no id is sent in url', async () => {
        const response = await request(server).patch('/api/products/').send({});
        expect(response.status).toBe(404);
    });

    it('should reject if invalid id is sent in url', async () => {
        const response = await request(server)
            .patch('/api/products/invalid')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
    });

    it('should reject if valid id is sent in url but product is not found', async () => {
        const response = await request(server)
            .patch('/api/products/999')
            .send({});
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Product not found');
    });

    it('should return boolean in availability field', async () => {
        const response = await request(server)
            .patch('/api/products/1')
            .send({});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(201);
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('DELETE /api/products', () => {
    it('should reject if no id is sent in url', async () => {
        const response = await request(server).delete('/api/products/');

        expect(response.status).toBe(404);
    });

    it('should reject if invalid id is sent in url', async () => {
        const response = await request(server).delete('/api/products/invalid');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
    });

    it('should reject if valid id is sent in url but product is not found', async () => {
        const response = await request(server)
            .delete('/api/products/999')
            .send({});
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Product not found');
    });

    it('should delete a product', async () => {
        const response = await request(server)
            .delete('/api/products/1')
            .send({});
        expect(response.status).toBe(200);
        expect(response.body).not.toHaveProperty('errors');
        expect(response.body.data).toBe('product deleted');
    });
});
