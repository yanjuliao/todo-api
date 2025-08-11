import { plainToInstance } from 'class-transformer';

export function toDto<T>(cls: new (...args: any[]) => T, data: unknown): T {
  return plainToInstance(cls, data);
}