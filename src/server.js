import cors from 'cors';
import express from 'express';
import swaggerRoute from './routes/swagger';
import { NotImplementedError } from './errors';
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
      const { hooks, path, handler } = { ...route };
      const { onRequest, validator, onResponse } = hooks || {};
      const routeExpress = this.getExpressRouteByMethod(route);
      const validators = validator || [];

      if (onRequest) {
        validators.unshift(...onRequest);
      }

      const args = [validators, handler, onResponse];
      routeExpress.bind(this.express)(path, ...args.filter(hook => !!hook));
    });
  }

  initializeMiddlewares() {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
  }

  getExpressRouteByMethod({ method }) {
    const availableMethods = {
      GET: this.express.get,
    };

    const routeExpress = availableMethods[method];

    if (!routeExpress) {
      throw new NotImplementedError(`Method [${method}] not implemented.`);
    }

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
