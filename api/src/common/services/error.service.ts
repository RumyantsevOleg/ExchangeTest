import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

// This is way how I implement error handling to split errors and exceptions
@Injectable()
export class ErrorService {
  constructor() {}

  public forbidden(message?: string): never {
    throw new ForbiddenException(message);
  }

  public badRequest(message?: string): never {
    throw new BadRequestException(message);
  }
}

// Todo implement ExceptionFilters
/*@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}*/
