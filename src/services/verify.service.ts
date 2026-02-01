import { Role, Discipline } from '../generated/prisma/client';

export function isValidRole(role: unknown): role is Role {
  return Object.values(Role).includes(role as Role);
}

export function isValidDiscipline(discipline: unknown): discipline is Discipline {
  return Object.values(Discipline).includes(discipline as Discipline);
}
