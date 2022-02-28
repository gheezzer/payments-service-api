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

  it('Should retrieve the payment slip data', async () => {
    const res = await request.get(
      '/v1/boleto/00190500954014481606906809350314337370000000100',
    );

    const { body } = res;

    expect(body).toEqual({
      barCode: '00193373700000001000500940144816060680935031',
      amount: '10,000',
      expirationDate: '31/12/2007',
    });
  });

  it('Should get a 400 error', async () => {
    const res = await request.get('/v1/boleto/123456');

    const { body } = res;

    expect(body).toEqual({
      details: {},
      error: 'BadRequestError',
      message: 'Invalid line value entered, only numbers are accepted',
      statusCode: 400,
    });
  });
});
