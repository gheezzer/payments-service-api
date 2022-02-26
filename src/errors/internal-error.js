export default class InternalServerError extends Error {
  constructor(message) {
    super(message || 'InternalServerError');
    this.name = 'InternalServerError';
    this.statusCode = 500;
    this.details = {};
  }
}
