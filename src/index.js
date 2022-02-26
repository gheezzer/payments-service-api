import 'dotenv/config';
import Server from './server';
import routesV1 from './routes/v1';

(async () => {
  try {
    new Server(routesV1).init();
  } catch (err) {
    console.error('expressServer', err);
  }
})();
