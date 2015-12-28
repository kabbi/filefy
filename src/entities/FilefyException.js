export default class FilefyException extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}
