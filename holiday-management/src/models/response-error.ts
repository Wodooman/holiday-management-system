export default class ResponseError extends Error {
  public status?: number;

  constructor(message: string, status: number = null) {
    super(message);
    this.status = status;
  }
}
