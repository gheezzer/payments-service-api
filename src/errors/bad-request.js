export default class BadRequestError extends Error {
  constructor(message) {
    super(message || 'BadRequest');
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.details = {};
  }
}
