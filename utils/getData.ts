import { Role, Discipline } from '../generated/prisma/client.js';
import { prisma } from '../db/prisma.js';

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

export async function getStudentsIndex() {
  try {
    return await prisma.student.findMany({
    take: 5,
    select: {
      firstName: true,
      lastName: true,
      photos: {
        select: {
          url: true
        },
        take: 1,
      }
    }
  });
  } catch (error) {
    return [];
  }
}

export async function getAllStudents() {
  try {
    return await prisma.student.findMany({
    select: {
      firstName: true,
      lastName: true,
      coachId: true,
      dateOfBirth: true,
      photos: {
        select: {
          url: true
        },
        take: 1,
      }
    }
  });
  } catch (error) {
    return [];
  }
}

export async function getStudentsByCoach(coachId: number) {
  try {
    return await prisma.student.findMany({
      where: {coachId: coachId},
      select: {
        firstName: true,
        lastName: true,
        middleName: true,
        dateOfBirth: true,
      }
    });
  } catch (error) {
    return [];
  }
} 

export async function getEventByCoachId(coachID: number) {
  try {
    if (isNaN(coachID)) throw new Error 

    const coach = await prisma.user.findUnique({
      where: {id: coachID, role: Role.coach},
    });

    if (coach === null) throw new Error 

    const data = await prisma.event.findFirst({
      where: {coachId: coach.id},
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        endDate: true,
        startDate: true,
        eventName: true,
        eventType: true,
        coach: {
          where: {id: coach.id},
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
        students: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          }
        }
      },
      take: 1,
    });
    return data;

  } catch (error) {
    return [];
  }
}
