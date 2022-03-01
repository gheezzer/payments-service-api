import supertest from 'supertest';
import Server from '../../src/server';
import v1Routes from '../../src/routes/v1';

describe('Dealership tests.', () => {
  let server;
  let request;

  beforeAll(() => {
    server = new Server(v1Routes).express;
    request = supertest(server);
  });

  it('Should retrieve the payment slip data', async () => {
    const res = await request.get(
      '/v1/boleto/846700000017435900240209024050002435842210108119',
    );

    const { body } = res;

    expect(body).toEqual({
      barCode: '84670000001435900240200240500024384221010811',
      amount: '143.59',
      expirationDate: '',
    });
  });
});
