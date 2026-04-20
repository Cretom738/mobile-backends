import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUsersService } from './users';
import { ERole, Prisma, User } from '.prisma/client';
import { UpdateCurrentUserDto } from './dtos/update-current-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SessionsService } from '../sessions/sessions.service';
import { FilterUsersDto } from './dtos/filter-users.dto';
import { PrismaService } from '../../libs/services/prisma.service';
import { ArgonService } from '../../libs/services/argon.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionsService,
    private readonly argon: ArgonService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<{
    id: number;
    role: ERole;
  }> {
    const password = await this.argon.hash(dto.password);

    delete dto['password'];

    const { id, role } = await this.prisma.user.create({
      data: {
        ...dto,
        password,
        role: ERole.USER,
      },
    });

    return {
      id,
      role,
    };
  }

  async findUsers({
    text,
    offset,
    limit,
    sortOrder,
  }: FilterUsersDto): Promise<[User[], number]> {
    const query: Prisma.UserFindManyArgs = text
      ? {
          where: {
            OR: [
              {
                fullName: {
                  contains: text,
                },
              },
              {
                email: {
                  contains: text,
                },
              },
            ],
          },
        }
      : {};

    return this.prisma.$transaction([
      this.prisma.user.findMany({
        where: query.where,
        skip: offset,
        take: limit,
        orderBy: {
          id: sortOrder,
        },
      }),
      this.prisma.user.count({
        where: query.where,
      }),
    ]);
  }

  async findUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findUserByEmail(email: string): Promise<{
    id: number;
    role: ERole;
    hashedPassword: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('auth.invalid.credentials');
    }

    return {
      id: user.id,
      role: user.role,
      hashedPassword: user.password,
    };
  }

  async updateCurrentUser(
    id: number,
    dto: UpdateCurrentUserDto,
  ): Promise<void> {
    const password = await this.argon.hash(dto.password);

    delete dto['password'];

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...dto,
        password,
      },
    });
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<void> {
    const password = await this.argon.hash(dto.password);

    delete dto['password'];

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...dto,
        password,
      },
      select: {
        sessions: true,
      },
    });

    if (dto.email || password) {
      await this.sessionService.deleteAllSessions(user.sessions);
    }
  }

  async removeUser(id: number): Promise<void> {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
      include: {
        sessions: true,
      },
    });

    await this.sessionService.blackListAllSessionsTokens(user.sessions);
  }
}
