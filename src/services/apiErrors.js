// En gemensam förälder för alla fel från VirusTotal, så att anroparen kan
// fånga alla API-fel på en gång eller skilja dem åt med instanceOf.
export class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiError";
  }
}

export class NetworkError extends ApiError {
  constructor() {
    super("No connection or the server did not respond");
    this.name = "NetworkError";
  }
}

export class TimeoutError extends ApiError {
  constructor() {
    super("The request took too long");
    this.name = "TimeoutError";
  }
}

export class QuotaExceededError extends ApiError {
  constructor() {
    super("VirusTotal quota exceeded (HTTP 429)");
    this.name = "QuotaExceededError";
  }
}

export class InvalidApiKeyError extends ApiError {
  constructor() {
    super("VirusTotal API key is missing or invalid (HTTP 401)");
    this.name = "InvalidApiKeyError";
  }
}
