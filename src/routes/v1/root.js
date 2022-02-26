import { index } from '../../controllers/rootController';

export default [
  {
    method: 'GET',
    path: '/',
    handler: index,
  },
];
