import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiStandardResponse(model?: Type<any>) {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Order was created.',
      type: model,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request. Check the data that was sent..',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized. The token is missing or invalid.',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. You do not have permission to perform this action.',
    }),
  );
}
