import root from './root';
import typeableLine from './typeableLine';

const version = '/v1';

export default [...root, ...typeableLine].map(endpoint => {
  return Object.assign(endpoint, { path: `${version}${endpoint.path}` });
});
