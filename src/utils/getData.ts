import { Role, Discipline } from '../generated/prisma/client';
import { prisma } from '../db/prisma';

export async function getCoaches() {
  try {
    return await prisma.user.findMany({
      where: { role: Role.coach },
      select: {
        firstName: true,
        lastName: true,
        middleName: true,
        discipline: true,
        id: true,
        photos: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });
  } catch (error) {
    return [];
  }
} 
