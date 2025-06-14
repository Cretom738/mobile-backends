import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createUsers } from './users';

const prisma = new PrismaClient();

const logger = new Logger();

const seed = async () => {
  await createUsers(prisma, logger);

  logger.debug('seed completed!');
};

seed()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
