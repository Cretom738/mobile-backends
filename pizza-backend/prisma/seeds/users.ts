import { Logger } from '@nestjs/common';
import { ERole, Prisma, PrismaClient } from '@prisma/client';
import { ArgonService } from 'src/libs/services/argon.service';

export const createUsers = async (prisma: PrismaClient, logger: Logger) => {
  const argon = new ArgonService();

  const users: Prisma.UserCreateInput[] = [
    {
      fullName: 'admin',
      email: 'admin@mail.com',
      password: await argon.hash('admin'),
      role: ERole.ADMIN,
    },
  ];

  const exists = await prisma.user.findFirst();

  if (!exists) {
    await prisma.user.createMany({
      data: users,
    });

    logger.debug('Users creation completed!');

    return;
  }

  logger.debug('Users already exist !');
};
