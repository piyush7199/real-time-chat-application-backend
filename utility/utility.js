import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const INTERNAL_SERVER_ERROR = "Internal Server Error";

export const generatedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

export const encode = async (value) => {
  const salt = await bcrypt.genSalt(2);
  const encodeValue = await bcrypt.hash(value, salt);
  return encodeValue;
};
