import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async plainPassword => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(plainPassword, salt);
  return hashed;
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
