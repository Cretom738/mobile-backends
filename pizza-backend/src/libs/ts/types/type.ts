import { Prisma } from '@prisma/client';

const orderWithRelatedTables = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: {
    orderProducts: {
      include: {
        orderProductIngredients: {
          include: {
            ingredient: true,
          },
        },
        product: true,
      },
    },
    user: true,
  },
});

export type OrderWithRelatedTables = Prisma.OrderGetPayload<
  typeof orderWithRelatedTables
>;

const orderWithUser = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: {
    user: true,
  },
});

export type OrderWithUser = Prisma.OrderGetPayload<typeof orderWithUser>;

const orderProductWithRelatedTables =
  Prisma.validator<Prisma.OrderProductDefaultArgs>()({
    include: {
      orderProductIngredients: {
        include: {
          ingredient: true,
        },
      },
      product: true,
    },
  });

export type OrderProductWithRelatedTables = Prisma.OrderProductGetPayload<
  typeof orderProductWithRelatedTables
>;

const orderProductIngredientWithRelatedTables =
  Prisma.validator<Prisma.OrderProductIngredientDefaultArgs>()({
    include: {
      ingredient: true,
    },
  });

export type OrderProductIngredientWithRelatedTables =
  Prisma.OrderProductIngredientGetPayload<
    typeof orderProductIngredientWithRelatedTables
  >;
