import { generate } from 'generate-password';

export const generateRandomPassword = () => {
  return generate({
    length: 12,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: true,
  });
};
