import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../ts/interfaces/jwt-payload.interface';

export const UserInfo = createParamDecorator(
  (_: undefined, context: ExecutionContext): IJwtPayload => {
    const request = context.switchToHttp().getRequest();
    return request['userInfo'];
  },
);
