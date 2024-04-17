import { HttpException } from '@nestjs/common';

/**
 * 自定义异常
 */
export class CustomException extends HttpException {
    constructor(errorMessage,httpStatus=300) {
      super(errorMessage, httpStatus);
    }
  }