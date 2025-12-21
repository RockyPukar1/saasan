import { randomUUID } from 'crypto';
import {
  HttpErrorCodeMessage,
  type HttpErrorCodeTypes,
} from '../utils/http-error-code';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Exclude, Expose, Transform } from 'class-transformer';

export class GlobalHttpException extends HttpException {
  @Expose() requestId: string;
  @Expose() statusCode: HttpStatus;
  @Expose() errorCode: HttpErrorCodeTypes;
  @Expose() message: string;
  @Expose()
  @Transform(({ obj }) => obj.additional as object)
  additional?: object;
  @Transform(({ obj }) => obj.payload as object)
  payload: object;

  constructor(
    errorCode: HttpErrorCodeTypes,
    httpStatus: HttpStatus,
    additional?: object,
  ) {
    const message = HttpErrorCodeMessage[errorCode];
    super(message, httpStatus);

    this.errorCode = errorCode;
    this.statusCode = httpStatus;
    this.additional = additional;
    this.message = message;
    this.requestId = randomUUID();
  }

  @Exclude() name: string;
}
