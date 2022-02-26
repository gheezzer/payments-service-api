export default class NotImplementedError extends Error {
  constructor(message) {
    super(message || 'NotImplemented');
    this.name = 'NotImplementedError';
    this.statusCode = 501;
    this.details = {};
  }
}
