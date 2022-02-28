import cors from 'cors';
import express from 'express';
import swaggerRoute from './routes/swagger';
import errorMiddleware from './middlewares/errors';

export default class Server {
  constructor(routes) {
    this.routes = routes;
    this.express = express();
    this.initializeRoutes();
    this.initializeErrorMiddlewares();
  }

  initializeErrorMiddlewares() {
    this.express.use(errorMiddleware);
  }

  initializeRoutes() {
    this.express.use(swaggerRoute);
    this.routes.forEach(route => {
      const { path, handler } = { ...route };
      const routeExpress = this.getExpressRouteByMethod(route);
      const args = [handler];
      routeExpress.bind(this.express)(path, ...args);
    });
  }

  initializeMiddlewares() {
    this.express.use(cors());
  }

  getExpressRouteByMethod({ method }) {
    const availableMethods = {
      GET: this.express.get,
    };

    const routeExpress = availableMethods[method];

    return routeExpress;
  }

  init() {
    const PORT = process.env.PORT_API || 3000;
    const app = this.express.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });

    return app;
  }
}
