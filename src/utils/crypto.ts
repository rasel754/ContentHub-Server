import crypto from 'crypto';

export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashString = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};
