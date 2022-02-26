import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/swagger';

const swaggerRoute = express.Router();

swaggerRoute.use('/swagger', swaggerUi.serve);
swaggerRoute.get(
  '/swagger',
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
  }),
);

export default swaggerRoute;
