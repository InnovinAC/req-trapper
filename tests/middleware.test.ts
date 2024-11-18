import express, { Request, Response, Express } from 'express';
import request from 'supertest';
import { ReqTrapper } from '../src/functionality/ReqTrapper';
import Helpers from '../src/functionality/Helpers';

describe('ReqTrapper Middleware', () => {
    let app: Express;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        const reqTrapper = new ReqTrapper({
            customValidations: [],
            helpers: new Helpers()
        });

        app.post('/test', reqTrapper.validate([
            { name: 'email', validation: 'required|email' },
            { name: 'age', validation: 'required|number|greater_than:18' }
        ]), (req: Request, res: Response) => {
            res.status(200).json({ success: true });
        });
    });

    it('should return 400 if email is missing', async () => {
        const response = await request(app)
            .post('/test')
            .send({ age: 20 });

        expect(response.status).toBe(400);
        expect(response.body.errors.email).toBe('The email is required.');
    });

    it('should return 400 if email is not valid', async () => {
        const response = await request(app)
            .post('/test')
            .send({ email: 'invalid-email', age: 20 });

        expect(response.status).toBe(400);
        expect(response.body.errors.email).toBe('The email must be a valid email address.');
    });

    it('should return 400 if age is not a number', async () => {
        const response = await request(app)
            .post('/test')
            .send({ email: 'test@example.com', age: 'not-a-number' });

        expect(response.status).toBe(400);
        expect(response.body.errors.age).toBe('The age must be a valid number.');
    });

    it('should return 400 if age is not greater than 18', async () => {
        const response = await request(app)
            .post('/test')
            .send({ email: 'test@example.com', age: 17 });

        expect(response.status).toBe(400);
        expect(response.body.errors.age).toBe('The age must be greater than 18.');
    });

    it('should return 200 if all validations pass', async () => {
        const response = await request(app)
            .post('/test')
            .send({ email: 'test@example.com', age: 20 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });
});