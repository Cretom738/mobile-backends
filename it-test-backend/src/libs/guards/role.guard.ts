import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ERole } from '@prisma/client';
import { EMetaKeys } from '../ts/enums/enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(
      EMetaKeys.ROLES_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();

    if (!request['isUserAuthenticated']) {
      throw new UnauthorizedException();
    }

    const userInfo = request['userInfo'];

    if (!userInfo) return false;

    const userRole = userInfo['role'];

    if (!userRole || userRole.length === 0) return false;

    return requiredRoles.some((role) => userRole === role);
  }
}
