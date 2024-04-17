import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let responseMsg = exception.getResponse()

    if(typeof responseMsg !== 'string'){
        responseMsg = (responseMsg as any).message
    }

    response
      .status(200)
      .json({
        resultCode:status,
        resultMsg: responseMsg,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}