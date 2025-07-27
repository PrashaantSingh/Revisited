import jwt from "jsonwebtoken";
export default function generateToken(secret, id) {
  return jwt.sign({ id }, secret, { expiresIn: "30d" });
}
