export class Exception extends Error {
  status = 500;
  code = "INTERNAL_SERVER_ERROR";
  message = "Internal server error";
  constructor() {
    super();
  }
}

export class UnauthorizedException extends Exception {
  status = 401;
  code = "UNAUTHORIZED";
  constructor(message) {
    super();
    this.message = message;
  }
}

export class ForbiddenException extends Exception {
  status = 403;
  code = "FORBIDDEN";
  constructor(message) {
    super();
    this.message = message;
  }
}

export class BadRequestException extends Exception {
  status = 400;
  code = "BAD_REQUEST";
  constructor(message) {
    super();
    this.message = message;
  }
}
