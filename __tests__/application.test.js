import supertest from 'supertest';
import Server from '../src/server';
import v1Routes from '../src/routes/v1';

describe('Application tests.', () => {
  let server;
  let request;

  beforeAll(() => {
    server = new Server(v1Routes).express;
    request = supertest(server);
  });

  it('Should validate the status check route', async () => {
    const res = await request.get('/v1');

    const { body } = res;

    expect(body).toEqual({
      endpoints: '/v1',
      status: 'Ok',
    });
  });

  it('Should get a 400 error', async () => {
    const res = await request.get('/v1/boleto/123456');

    const { body } = res;

    expect(body).toEqual({
      details: {},
      error: 'BadRequestError',
      message: 'Invalid line value entered',
      statusCode: 400,
    });
  });
});
