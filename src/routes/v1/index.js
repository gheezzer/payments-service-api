import root from './root';

const version = '/v1';

export default [...root].map(endpoint => {
  return Object.assign(endpoint, { path: `${version}${endpoint.path}` });
});
