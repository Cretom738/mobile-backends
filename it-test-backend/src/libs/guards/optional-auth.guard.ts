import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request['isUserAuthenticated']) return true;

    if (request.headers.authorization && !request['isUserAuthenticated']) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
