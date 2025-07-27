import { jwtDecode } from "jwt-decode";

export default function validateToken(token) {
  try {
    const { exp } = jwtDecode(token);
    return !(Date.now() >= exp * 1000);
  } catch (error) {
    return false;
  }
}
