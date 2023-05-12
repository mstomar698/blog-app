/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
import jwt from "jsonwebtoken";

const secret: any = process.env.NEXTAUTH_SECRET;
export const createSession = async (user: any) => {
    
  const payload: any = {
    id: user.id,
    email: user.email,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  return {
    token,
    user,
  };
};

